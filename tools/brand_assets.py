"""Shared brand resources for generated GetCourse pages."""
import os

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
SCRIPT_TAG = '<script src="https://cifrazakup.ru/school-brand.js?v=20261101" defer></script>\n'

def embed_script():
    # Inline the small bootstrap into existing bundles, so their live URLs keep working.
    with open(os.path.join(ROOT, 'school-brand.js'), encoding='utf-8') as f:
        return '\n' + f.read().rstrip() + '\n'
