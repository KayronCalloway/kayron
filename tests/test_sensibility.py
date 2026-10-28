"""Consistency checks for the portfolio's curated social previews.

Run with: python3 -m unittest discover -s tests -v
"""
import json
from html.parser import HTMLParser
from pathlib import Path
import re
import unittest

ROOT = Path(__file__).resolve().parents[1]
CHANNEL = ROOT / "channels/ch6"


class PreviewParser(HTMLParser):
    def __init__(self, html):
        super().__init__()
        self.links = {}
        self.feed(html)

    def handle_starttag(self, tag, attrs):
        attrs = dict(attrs)
        if tag == "a":
            for name in ("instagram-preview", "tidal-preview", "letterboxd-preview"):
                if name in (attrs.get("class") or "").split():
                    self.links[name] = attrs


class SensibilityTests(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        cls.data = json.loads((CHANNEL / "sensibility-data.json").read_text())
        cls.html = (CHANNEL / "index.html").read_text()
        cls.previews = PreviewParser(cls.html).links
        cls.worker = (ROOT / "service-worker.js").read_text()

    def test_instagram_fallback_matches_selected_post(self):
        self.assertEqual(self.previews["instagram-preview"]["href"],
                         self.data["instagram"]["post"]["url"])
        self.assertEqual(self.data["instagram"]["postUrl"],
                         self.data["instagram"]["post"]["url"])

    def test_tidal_fallback_matches_selected_playlist(self):
        self.assertEqual(self.previews["tidal-preview"]["href"],
                         self.data["tidal"]["url"])

    def test_schema_matches_selected_playlist(self):
        root = (ROOT / "index.html").read_text()
        match = re.search(
            r'<script type="application/ld\+json">(.*?)</script>', root, re.S
        )
        self.assertIsNotNone(match)
        assert match is not None
        schema = json.loads(match.group(1))
        playlists = [url for url in schema["sameAs"] if "tidal.com/playlist/" in url]
        self.assertEqual(playlists, [self.data["tidal"]["url"]])

    def test_tidal_footer_has_no_hardcoded_month(self):
        tidal = self.html.split('class="sensibility-preview tidal-preview"', 1)[1]
        self.assertRegex(tidal, r'<span class="handle">TIDAL</span>')

    def test_no_volatile_playlist_metadata(self):
        self.assertFalse({"trackCount", "tracks", "duration", "numberOfTracks"}
                         .intersection(self.data["tidal"]))

    def test_no_static_instagram_metrics(self):
        self.assertNotIn("stats", self.data["instagram"])
        self.assertNotIn("description", self.data["instagram"])

    def test_selected_local_media_is_precached(self):
        media = [self.data["tidal"]["coverLocal"],
                 self.data["instagram"]["post"]["imageLocal"]]
        media += [film["posterLocal"] for film in self.data["letterboxd"]["films"]]
        for path in media:
            with self.subTest(path=path):
                self.assertTrue((ROOT / path).is_file())
                self.assertIn("'" + path + "'", self.worker)

    def test_all_precached_assets_exist(self):
        paths = re.search(r"const CACHE_ASSETS = \[(.*?)\];", self.worker, re.S)
        self.assertIsNotNone(paths)
        assert paths is not None
        for path in re.findall(r"'([^']+)'", paths.group(1)):
            with self.subTest(path=path):
                self.assertTrue((ROOT / path).exists())

    def test_outbound_links_are_safe(self):
        self.assertEqual(len(self.previews), 3)
        for name, attrs in self.previews.items():
            with self.subTest(preview=name):
                self.assertEqual(attrs["target"], "_blank")
                self.assertTrue({"noopener", "noreferrer"}.issubset(attrs["rel"].split()))
                self.assertTrue(attrs["href"].startswith("https://"))


if __name__ == "__main__":
    unittest.main()
