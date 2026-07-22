from __future__ import annotations

from dataclasses import asdict, dataclass
from functools import cache
import hashlib
import json
from pathlib import Path
import shutil
import subprocess
from typing import Any, Literal


class VietBaziError(RuntimeError):
    """Raised when the TypeScript calculation engine rejects the request."""


def _verify_engine_dir(root: Path) -> dict[str, Any]:
    manifest_path = root / "manifest.json"
    try:
        manifest: dict[str, Any] = json.loads(manifest_path.read_text(encoding="utf-8"))
    except (OSError, json.JSONDecodeError) as error:
        raise VietBaziError("Bundled engine manifest không hợp lệ") from error
    if manifest.get("formatVersion") != 1 or not isinstance(manifest.get("engineVersion"), str) or not isinstance(manifest.get("files"), dict):
        raise VietBaziError("Bundled engine manifest không đúng format v1")
    expected_files = set(manifest["files"])
    actual_files = {path.relative_to(root).as_posix() for path in root.rglob("*") if path.is_file() and path.name != "manifest.json"}
    if expected_files != actual_files:
        raise VietBaziError("Bundled engine có danh sách file không khớp manifest")
    for relative, expected in manifest["files"].items():
        relative_path = Path(relative)
        if relative_path.is_absolute() or ".." in relative_path.parts or not isinstance(expected, dict):
            raise VietBaziError("Bundled engine manifest chứa path không an toàn")
        try:
            content = (root / relative_path).read_bytes()
        except OSError as error:
            raise VietBaziError(f"Không đọc được bundled engine file: {relative}") from error
        digest = hashlib.sha256(content).hexdigest()
        if expected.get("bytes") != len(content) or expected.get("sha256") != digest:
            raise VietBaziError(f"Bundled engine integrity check thất bại: {relative}")
    return {"engineVersion": manifest["engineVersion"], "files": len(expected_files), "verified": True}


@cache
def verify_bundled_engine() -> dict[str, Any]:
    return _verify_engine_dir(Path(__file__).resolve().with_name("_engine"))


@dataclass(frozen=True, slots=True)
class BirthInput:
    localDateTime: str
    timezoneOffsetMinutes: int
    gender: Literal["male", "female"]
    asOfYear: int
    location: dict[str, str | float] | None = None
    trueSolarTime: bool = False
    dayBoundary: Literal["early-zi", "midnight"] = "early-zi"

    def to_payload(self) -> dict[str, Any]:
        value = asdict(self)
        if self.location is None:
            value.pop("location")
        if not self.trueSolarTime:
            value.pop("trueSolarTime")
        if self.dayBoundary == "early-zi":
            value.pop("dayBoundary")
        return value


def _command() -> list[str]:
    node = shutil.which("node")
    bundled_cli = Path(__file__).resolve().with_name("_engine") / "cli.js"
    if node and bundled_cli.is_file():
        verify_bundled_engine()
        return [node, str(bundled_cli)]
    installed = shutil.which("viet-bazi")
    if installed:
        return [installed]
    local_cli = Path(__file__).resolve().parents[3] / "dist" / "cli.js"
    if node and local_cli.is_file():
        return [node, str(local_cli)]
    raise VietBaziError("Không tìm thấy Node.js hoặc CLI viet-bazi. Python binding yêu cầu Node.js 20+ để chạy engine đi kèm.")


def get_capabilities() -> dict[str, Any]:
    completed = subprocess.run([*_command(), "--capabilities", "--compact"], text=True, capture_output=True, check=False)
    if completed.returncode != 0:
        raise VietBaziError(completed.stderr.strip() or f"Engine thoát với mã {completed.returncode}")
    try:
        result: dict[str, Any] = json.loads(completed.stdout)
    except json.JSONDecodeError as error:
        raise VietBaziError("Engine không trả JSON capabilities hợp lệ") from error
    return result


def calculate_bazi(value: BirthInput) -> dict[str, Any]:
    command = [*_command(), "--compact"]
    command.append(json.dumps(value.to_payload(), ensure_ascii=False, separators=(",", ":")))
    completed = subprocess.run(command, text=True, capture_output=True, check=False)
    if completed.returncode != 0:
        raise VietBaziError(completed.stderr.strip() or f"Engine thoát với mã {completed.returncode}")
    try:
        result: dict[str, Any] = json.loads(completed.stdout)
    except json.JSONDecodeError as error:
        raise VietBaziError("Engine không trả JSON hợp lệ") from error
    return result


def create_bazi_audit_report(value: BirthInput) -> dict[str, Any]:
    command = [*_command(), "--compact", "--audit", "--stdin"]
    completed = subprocess.run(command, input=json.dumps(value.to_payload(), ensure_ascii=False, separators=(",", ":")), text=True, capture_output=True, check=False)
    if completed.returncode != 0:
        raise VietBaziError(completed.stderr.strip() or f"Engine thoát với mã {completed.returncode}")
    try:
        result: dict[str, Any] = json.loads(completed.stdout)
    except json.JSONDecodeError as error:
        raise VietBaziError("Engine không trả JSON audit hợp lệ") from error
    return result


def calculate_bazi_batch(values: list[BirthInput]) -> dict[str, Any]:
    command = [*_command(), "--compact", "--batch", "--stdin"]
    payload = [value.to_payload() for value in values]
    completed = subprocess.run(command, input=json.dumps(payload, ensure_ascii=False, separators=(",", ":")), text=True, capture_output=True, check=False)
    if completed.returncode != 0:
        raise VietBaziError(completed.stderr.strip() or f"Engine thoát với mã {completed.returncode}")
    try:
        result: dict[str, Any] = json.loads(completed.stdout)
    except json.JSONDecodeError as error:
        raise VietBaziError("Engine không trả JSON batch hợp lệ") from error
    return result


def compare_birth_inputs(first: BirthInput, second: BirthInput) -> dict[str, Any]:
    command = [*_command(), "--compact", "--compatibility", "--stdin"]
    payload = [first.to_payload(), second.to_payload()]
    completed = subprocess.run(command, input=json.dumps(payload, ensure_ascii=False, separators=(",", ":")), text=True, capture_output=True, check=False)
    if completed.returncode != 0:
        raise VietBaziError(completed.stderr.strip() or f"Engine thoát với mã {completed.returncode}")
    try:
        result: dict[str, Any] = json.loads(completed.stdout)
    except json.JSONDecodeError as error:
        raise VietBaziError("Engine không trả JSON compatibility hợp lệ") from error
    return result


def render_bazi_svg(value: BirthInput, *, locale: Literal["vi", "en"] = "vi", title: str | None = None, width: int | None = None, show_hidden_stems: bool = True) -> str:
    command = [*_command(), "--stdin", "--svg", "--locale", locale]
    if title is not None:
        command.extend(["--title", title])
    if width is not None:
        command.extend(["--width", str(width)])
    if not show_hidden_stems:
        command.append("--no-hidden-stems")
    completed = subprocess.run(command, input=json.dumps(value.to_payload(), ensure_ascii=False, separators=(",", ":")), text=True, capture_output=True, check=False)
    if completed.returncode != 0:
        raise VietBaziError(completed.stderr.strip() or f"Engine thoát với mã {completed.returncode}")
    if not completed.stdout.startswith("<svg"):
        raise VietBaziError("Engine không trả SVG hợp lệ")
    return completed.stdout.rstrip("\n")


def analyze_birth_time_sensitivity(value: BirthInput, window_minutes: int = 120, step_minutes: int = 5) -> dict[str, Any]:
    command = [*_command(), "--compact", "--stdin", "--sensitivity", f"{window_minutes}:{step_minutes}"]
    completed = subprocess.run(command, input=json.dumps(value.to_payload(), ensure_ascii=False, separators=(",", ":")), text=True, capture_output=True, check=False)
    if completed.returncode != 0:
        raise VietBaziError(completed.stderr.strip() or f"Engine thoát với mã {completed.returncode}")
    try:
        result: dict[str, Any] = json.loads(completed.stdout)
    except json.JSONDecodeError as error:
        raise VietBaziError("Engine không trả JSON sensitivity hợp lệ") from error
    return result


def calculate_annual_timeline(value: BirthInput, from_year: int, to_year: int) -> list[dict[str, Any]]:
    command = [*_command(), "--compact", "--timeline", f"{from_year}:{to_year}", json.dumps(value.to_payload(), ensure_ascii=False, separators=(",", ":"))]
    completed = subprocess.run(command, text=True, capture_output=True, check=False)
    if completed.returncode != 0:
        raise VietBaziError(completed.stderr.strip() or f"Engine thoát với mã {completed.returncode}")
    try:
        result: list[dict[str, Any]] = json.loads(completed.stdout)
    except json.JSONDecodeError as error:
        raise VietBaziError("Engine không trả JSON timeline hợp lệ") from error
    return result
