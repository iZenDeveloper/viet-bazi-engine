from __future__ import annotations

from dataclasses import asdict, dataclass
import json
from pathlib import Path
import shutil
import subprocess
from typing import Any, Literal


class VietBaziError(RuntimeError):
    """Raised when the TypeScript calculation engine rejects the request."""


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
    installed = shutil.which("viet-bazi")
    if installed:
        return [installed]
    node = shutil.which("node")
    local_cli = Path(__file__).resolve().parents[3] / "dist" / "cli.js"
    if node and local_cli.is_file():
        return [node, str(local_cli)]
    raise VietBaziError("Không tìm thấy CLI viet-bazi. Hãy cài npm package hoặc build workspace trước.")


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
