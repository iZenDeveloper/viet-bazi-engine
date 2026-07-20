import unittest
from pathlib import Path
import shutil
import tempfile

from viet_bazi import BirthInput, VietBaziError, analyze_birth_time_sensitivity, calculate_annual_timeline, calculate_bazi, calculate_bazi_batch, get_capabilities, verify_bundled_engine
from viet_bazi.client import _verify_engine_dir


class ClientTest(unittest.TestCase):
    def test_calculates_through_local_engine(self) -> None:
        result = calculate_bazi(BirthInput("2000-01-07T12:00:00", 420, "male", 2026))
        self.assertEqual(result["schemaVersion"], "1.7")
        self.assertEqual(result["metadata"]["methodology"]["engineVersion"], "0.21.0")
        self.assertEqual(result["pillars"]["day"]["stem"]["name"], "Giáp")

    def test_surfaces_engine_errors(self) -> None:
        with self.assertRaises(VietBaziError):
            calculate_bazi(BirthInput("not-a-date", 420, "male", 2026))

    def test_calculates_annual_timeline(self) -> None:
        result = calculate_annual_timeline(BirthInput("2000-01-07T12:00:00", 420, "male", 2026), 2025, 2027)
        self.assertEqual([item["year"] for item in result], [2025, 2026, 2027])
        self.assertEqual(result[1]["analysis"]["pillar"]["branch"]["code"], "WU")

    def test_selects_midnight_day_boundary(self) -> None:
        result = calculate_bazi(BirthInput("2000-01-07T23:30:00", 420, "male", 2026, dayBoundary="midnight"))
        self.assertEqual(result["pillars"]["day"]["stem"]["code"], "JIA")
        self.assertEqual(result["normalized"]["dayBoundary"], "midnight")

    def test_calculates_batch_in_input_order(self) -> None:
        values = [BirthInput("2000-01-07T12:00:00", 420, "male", 2026), BirthInput("not-a-date", 420, "male", 2026)]
        result = calculate_bazi_batch(values)
        self.assertEqual(result["summary"], {"total": 2, "succeeded": 1, "failed": 1})
        self.assertEqual([item["ok"] for item in result["items"]], [True, False])

    def test_analyzes_birth_time_sensitivity(self) -> None:
        result = analyze_birth_time_sensitivity(BirthInput("2026-02-04T03:00:00", 420, "male", 2026), 15, 5)
        self.assertFalse(result["stable"])
        self.assertEqual(result["sampleCount"], 7)
        self.assertTrue(any("MONTH" in item["changedPillars"] for item in result["variants"]))

    def test_discovers_engine_capabilities(self) -> None:
        result = get_capabilities()
        self.assertTrue(result["offline"])
        self.assertEqual(result["runtimeDependencyCount"], 0)
        self.assertIn("BIRTH_TIME_SENSITIVITY", result["features"])

    def test_verifies_bundled_engine_integrity(self) -> None:
        result = verify_bundled_engine()
        self.assertEqual(result, {"engineVersion": "0.21.0", "files": 19, "verified": True})

    def test_rejects_a_tampered_bundled_engine(self) -> None:
        source = Path(__file__).resolve().parents[1] / "viet_bazi" / "_engine"
        with tempfile.TemporaryDirectory() as directory:
            target = Path(directory) / "engine"
            shutil.copytree(source, target)
            cli = target / "cli.js"
            cli.write_bytes(cli.read_bytes() + b"\n")
            with self.assertRaisesRegex(VietBaziError, "integrity check"):
                _verify_engine_dir(target)


if __name__ == "__main__":
    unittest.main()
