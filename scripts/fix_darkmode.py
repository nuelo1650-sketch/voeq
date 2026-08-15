#!/usr/bin/env python3
"""Add dark: counterparts to unpaired light tailwind tokens in web .tsx files.
Light tokens that need inverting (forest text -> cream text; cream bg/border -> forest):
  text-forest-500/700/800/900[/NN]  -> dark:text-cream-100[/NN]
  bg-cream-50                       -> dark:bg-forest-800
  bg-cream-50/NN                    -> dark:bg-forest-800/NN
  bg-cream-100                      -> dark:bg-forest-900
  bg-cream-200                      -> dark:bg-forest-700
  border-cream-100/200/300[/NN]     -> dark:border-forest-700[/NN]
  border-forest-700[/NN]            -> dark:border-cream-100[/NN]
Skip (already correct in dark mode): bg-forest-*, text-cream-*, border-forest-900 etc.
Only adds a dark: variant if that exact dark: token is not already present in the class string.
"""
import re, os, glob, sys

LIGHT_TEXT = {
    'text-forest-500': 'dark:text-cream-100',
    'text-forest-700': 'dark:text-cream-100',
    'text-forest-800': 'dark:text-cream-100',
    'text-forest-900': 'dark:text-cream-100',
}
# bg-cream variants (opacity-aware)
BG_CREAM = {
    'bg-cream-50': 'dark:bg-forest-800',
    'bg-cream-100': 'dark:bg-forest-900',
    'bg-cream-200': 'dark:bg-forest-700',
}
BORDER_CREAM = {
    'border-cream-100': 'dark:border-forest-700',
    'border-cream-200': 'dark:border-forest-700',
    'border-cream-300': 'dark:border-forest-700',
}
BORDER_FOREST = {
    'border-forest-700': 'dark:border-cream-100',
}

TOKEN_RE = re.compile(r'(bg|text|border)-(forest|cream)-(\d+)(?:/(\d+))?')

def dark_for(token):
    # token like 'text-forest-700' or 'bg-cream-50/80'
    m = TOKEN_RE.match(token)
    if not m:
        return None
    kind, fam, num, op = m.groups()
    op_suf = f'/{op}' if op else ''
    full = f'{kind}-{fam}-{num}{op_suf}'
    if kind == 'text' and fam == 'forest' and num in ('500','700','800','900'):
        return f'dark:text-cream-100{op_suf}'
    if kind == 'bg' and fam == 'cream' and num in ('50','100','200'):
        tgt = {'50':'forest-800','100':'forest-900','200':'forest-700'}[num]
        return f'dark:bg-{tgt}{op_suf}'
    if kind == 'border' and fam == 'cream' and num in ('100','200','300'):
        return f'dark:border-forest-700{op_suf}'
    if kind == 'border' and fam == 'forest' and num == '700':
        return f'dark:border-cream-100{op_suf}'
    return None

def process_classstring(s):
    # skip if no transformable token
    if not TOKEN_RE.search(s):
        return s
    # exact dark: tokens already present (to avoid duplicates)
    present_dark = set(re.findall(r'dark:(bg|text|border)-(forest|cream)-\d+(?:/\d+)?', s))
    adds = []
    for m in TOKEN_RE.finditer(s):
        kind, fam, num, op = m.groups()
        op_suf = f'/{op}' if op else ''
        full = f'{kind}-{fam}-{num}{op_suf}'
        d = dark_for(full)
        if not d:
            continue
        # skip if this exact dark variant already present
        d_exact = d  # d already includes opacity suffix
        if d_exact in present_dark or d_exact in s:
            continue
        if d_exact in adds:
            continue
        adds.append(d_exact)
    if not adds:
        return s
    return s + ' ' + ' '.join(adds)

# match className="..." and className={`...`} (template literals too)
CLASS_RE = re.compile(r'className=(\{"([^"]*)"\}|\{"([^"]*)"\}|\"([^\"]*)\")')

def process_file(path):
    with open(path, 'r', encoding='utf-8') as f:
        content = f.read()
    new = content
    # handle className="..." plain
    def repl_plain(m):
        s = m.group(1)
        return 'className="' + process_classstring(s) + '"'
    new = re.sub(r'className="([^"]*)"', repl_plain, new)
    # handle className={`...`} template literals (only the static parts before {)
    def repl_tmpl(m):
        s = m.group(1)
        return 'className={`' + process_classstring(s) + '`}'
    new = re.sub(r'className={`([^`]*)`}', repl_tmpl, new)
    if new != content:
        with open(path, 'w', encoding='utf-8') as f:
            f.write(new)
        return True
    return False

root = 'apps/web/src'
files = glob.glob(os.path.join(root, '**', '*.tsx'), recursive=True)
changed = 0
for fp in files:
    if process_file(fp):
        changed += 1
print(f'changed {changed} files')
