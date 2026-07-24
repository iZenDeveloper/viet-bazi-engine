import unittest
from pathlib import Path
import shutil
import tempfile

from viet_bazi import BirthInput, VietBaziError, analyze_birth_time_sensitivity, calculate_annual_timeline, calculate_bazi, calculate_bazi_batch, compare_birth_inputs, create_bazi_audit_report, get_capabilities, localize_annual_timeline, localize_bazi_audit_report, localize_birth_time_sensitivity, localize_chart_summary, localize_compatibility, localize_methodology, render_bazi_svg, verify_bundled_engine
from viet_bazi.client import _verify_engine_dir


class ClientTest(unittest.TestCase):
    def test_calculates_through_local_engine(self) -> None:
        result = calculate_bazi(BirthInput("2000-01-07T12:00:00", 420, "male", 2026))
        self.assertEqual(result["schemaVersion"], "1.7")
        self.assertEqual(result["metadata"]["methodology"]["engineVersion"], "0.42.0")
        self.assertEqual(result["pillars"]["day"]["stem"]["name"], "Giáp")

    def test_surfaces_engine_errors(self) -> None:
        with self.assertRaises(VietBaziError):
            calculate_bazi(BirthInput("not-a-date", 420, "male", 2026))

    def test_localizes_chart_summary(self) -> None:
        result = localize_chart_summary(BirthInput("2000-01-07T12:00:00", 420, "male", 2026), locale="en")
        self.assertEqual(result["locale"], "en")
        self.assertEqual(result["pillars"]["day"]["stemCode"], "JIA")
        self.assertEqual(len(result["elements"]), 5)

    def test_calculates_annual_timeline(self) -> None:
        result = calculate_annual_timeline(BirthInput("2000-01-07T12:00:00", 420, "male", 2026), 2025, 2027)
        self.assertEqual([item["year"] for item in result], [2025, 2026, 2027])
        self.assertEqual(result[1]["analysis"]["pillar"]["branch"]["code"], "WU")

    def test_localizes_annual_timeline(self) -> None:
        result = localize_annual_timeline(BirthInput("2000-01-07T12:00:00", 420, "male", 2026), 2025, 2027, locale="en")
        self.assertEqual(result["locale"], "en")
        self.assertEqual(len(result["entries"]), 3)
        self.assertIn("stemCode", result["entries"][0]["annual"])

    def test_selects_midnight_day_boundary(self) -> None:
        result = calculate_bazi(BirthInput("2000-01-07T23:30:00", 420, "male", 2026, dayBoundary="midnight"))
        self.assertEqual(result["pillars"]["day"]["stem"]["code"], "JIA")
        self.assertEqual(result["normalized"]["dayBoundary"], "midnight")

    def test_calculates_batch_in_input_order(self) -> None:
        values = [BirthInput("2000-01-07T12:00:00", 420, "male", 2026), BirthInput("not-a-date", 420, "male", 2026)]
        result = calculate_bazi_batch(values)
        self.assertEqual(result["summary"], {"total": 2, "succeeded": 1, "failed": 1})
        self.assertEqual([item["ok"] for item in result["items"]], [True, False])

    def test_compares_two_birth_inputs(self) -> None:
        first = BirthInput("1990-05-17T14:30:00", 420, "female", 2026)
        second = BirthInput("1988-11-02T08:10:00", 420, "male", 2026)
        result = compare_birth_inputs(first, second)
        self.assertEqual(result["schemaVersion"], "1.0")
        self.assertEqual(len(result["factors"]), 4)
        self.assertEqual(sum(item["score"] for item in result["factors"]), result["score"])

    def test_localizes_compatibility(self) -> None:
        first = BirthInput("1990-05-17T14:30:00", 420, "female", 2026)
        second = BirthInput("1988-11-02T08:10:00", 420, "male", 2026)
        result = localize_compatibility(first, second, locale="en")
        self.assertEqual(result["locale"], "en")
        self.assertIn(result["gradeCode"], ["LOW", "MEDIUM", "GOOD", "HIGH"])
        self.assertEqual(len(result["factors"]), 4)

    def test_renders_accessible_svg(self) -> None:
        result = render_bazi_svg(BirthInput("2000-01-07T12:00:00", 420, "male", 2026), locale="en", title="A < B", width=640, show_hidden_stems=False, high_contrast=True)
        self.assertTrue(result.startswith("<svg"))
        self.assertIn("A &lt; B", result)
        self.assertIn("aria-labelledby", result)
        self.assertNotIn('class="hidden"', result)
        self.assertIn('class="element-balance"', result)
        self.assertIn('data-contrast="high"', result)

    def test_creates_machine_readable_audit_report(self) -> None:
        result = create_bazi_audit_report(BirthInput("2000-01-07T12:00:00", 420, "male", 2026))
        self.assertEqual(result["schemaVersion"], "1.0")
        self.assertEqual(result["chartSchemaVersion"], "1.7")
        self.assertTrue(any(rule["ruleCode"] == "TEN_GODS_DAY_MASTER" for rule in result["rules"]))

    def test_localizes_audit_report(self) -> None:
        result = localize_bazi_audit_report(BirthInput("2000-01-07T12:00:00", 420, "male", 2026), locale="en")
        self.assertEqual(result["locale"], "en")
        self.assertTrue(all("text" in rule and "descriptionVi" not in rule for rule in result["rules"]))

    def test_analyzes_birth_time_sensitivity(self) -> None:
        result = analyze_birth_time_sensitivity(BirthInput("2026-02-04T03:00:00", 420, "male", 2026), 15, 5)
        self.assertFalse(result["stable"])
        self.assertEqual(result["sampleCount"], 7)
        self.assertTrue(any("MONTH" in item["changedPillars"] for item in result["variants"]))

    def test_localizes_birth_time_sensitivity(self) -> None:
        result = localize_birth_time_sensitivity(BirthInput("2026-02-04T03:00:00", 420, "male", 2026), 15, 5, locale="en")
        self.assertEqual(result["locale"], "en")
        self.assertTrue(any("Month" in item["changedPillars"] and "MONTH" in item["changedPillarCodes"] for item in result["variants"]))

    def test_discovers_engine_capabilities(self) -> None:
        result = get_capabilities()
        self.assertTrue(result["offline"])
        self.assertEqual(result["runtimeDependencyCount"], 0)
        self.assertIn("BIRTH_TIME_SENSITIVITY", result["features"])

    def test_localizes_methodology(self) -> None:
        result = localize_methodology(BirthInput("2000-01-07T12:00:00", 420, "male", 2026), locale="en")
        self.assertEqual(result["locale"], "en")
        self.assertEqual(len(result["items"]), 13)
        self.assertEqual(result["items"][0]["code"], "YEAR_BOUNDARY")

    def test_verifies_bundled_engine_integrity(self) -> None:
        result = verify_bundled_engine()
        self.assertEqual(result, {"engineVersion": "0.42.0", "files": 21, "verified": True})

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
