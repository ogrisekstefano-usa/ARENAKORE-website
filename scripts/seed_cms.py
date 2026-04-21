#!/usr/bin/env python3
"""
ArenaKore CMS Content Seeder
Seeds page content directly into MongoDB — NO server.py modifications needed.

Usage:
  python3 scripts/seed_cms.py --slug arena-matches [--force] [--api URL]

All content goes directly to the DB via the CMS API.
This is the ONLY correct way to add/update page content.
"""
import sys, json, os, argparse
import urllib.request, urllib.error

def get_api_url():
    # Try env first, fallback to localhost
    url = os.environ.get('REACT_APP_BACKEND_URL', 'http://localhost:8001')
    return url.rstrip('/')

def admin_login(api_url: str, password: str = 'ArenaKore2026!') -> str:
    data = json.dumps({'password': password}).encode()
    req = urllib.request.Request(f'{api_url}/api/admin/login',
        data=data, headers={'Content-Type': 'application/json'}, method='POST')
    with urllib.request.urlopen(req) as r:
        return json.loads(r.read())['token']

def seed_page(api_url: str, token: str, slug: str, sections: list, force: bool = False) -> dict:
    endpoint = f'{api_url}/api/cms/content/{slug}?note=seeded&created_by=seed_cms.py&auto_publish=true'
    if force:
        endpoint += '&force=true'
    data = json.dumps(sections).encode()
    req = urllib.request.Request(endpoint, data=data,
        headers={'Content-Type': 'application/json', 'Authorization': f'Bearer {token}'},
        method='PUT')
    try:
        with urllib.request.urlopen(req) as r:
            return {'ok': True, 'status': r.status}
    except urllib.error.HTTPError as e:
        return {'ok': False, 'error': e.read().decode()}

# ─── PAGE DEFINITIONS ────────────────────────────────────────────────────────
# Add new pages here. Each page is a list of sections with EN/IT/ES translations.

PAGES = {

    "arena-matches": [
        {"key": "hero_badge",      "field_type": "label",
         "translations": {
            "en": "ARENA MATCHES",
            "it": "SFIDE ARENA",
            "es": "PARTIDOS DEL ARENA"}},
        {"key": "hero_h1",         "field_type": "heading",
         "translations": {
            "en": "NEXUS ASSIGNS THE MATCH.",
            "it": "NEXUS ASSEGNA LA SFIDA.",
            "es": "NEXUS ASIGNA EL DUELO."}},
        {"key": "hero_sub",        "field_type": "text",
         "translations": {
            "en": "Direct challenges. Certified results. No room for doubt.",
            "it": "Sfide dirette. Risultati certificati. Nessun margine di dubbio.",
            "es": "Duelos directos. Resultados certificados. Sin margen de duda."}},
        {"key": "hero_nexus_line", "field_type": "text",
         "translations": {
            "en": "NEXUS creates and selects challenges designed by professional coaches and validated on thousands of athletes.",
            "it": "NEXUS crea e seleziona sfide progettate da coach professionisti e validate su migliaia di atleti.",
            "es": "NEXUS crea y selecciona desafíos diseñados por entrenadores profesionales y validados con miles de atletas."}},
        {"key": "how_badge",       "field_type": "label",
         "translations": {
            "en": "HOW IT WORKS",
            "it": "COME FUNZIONA",
            "es": "CÓMO FUNCIONA"}},
        {"key": "how_h2",          "field_type": "heading",
         "translations": {
            "en": "A MATCH IN 4 PHASES.",
            "it": "UNA SFIDA IN 4 FASI.",
            "es": "UN DUELO EN 4 FASES."}},
        {"key": "how_s1_title",    "field_type": "heading",
         "translations": {
            "en": "NEXUS assigns the match",
            "it": "NEXUS assegna la sfida",
            "es": "NEXUS asigna el duelo"}},
        {"key": "how_s1_desc",     "field_type": "text",
         "translations": {
            "en": "Based on your K-Rating and profile, NEXUS assigns a direct match against an athlete at your level.",
            "it": "In base al tuo K-Rating e profilo, NEXUS assegna una sfida diretta contro un atleta del tuo livello.",
            "es": "Basándose en tu K-Rating y perfil, NEXUS asigna un duelo directo contra un atleta de tu nivel."}},
        {"key": "how_s2_title",    "field_type": "heading",
         "translations": {
            "en": "Both athletes execute",
            "it": "Entrambi gli atleti eseguono",
            "es": "Ambos atletas ejecutan"}},
        {"key": "how_s2_desc",     "field_type": "text",
         "translations": {
            "en": "Each athlete performs the assigned challenge independently. NEXUS validates every rep in real time.",
            "it": "Ogni atleta esegue la sfida assegnata in modo indipendente. NEXUS valida ogni rep in tempo reale.",
            "es": "Cada atleta realiza el desafío asignado de forma independiente. NEXUS valida cada rep en tiempo real."}},
        {"key": "how_s3_title",    "field_type": "heading",
         "translations": {
            "en": "NEXUS certifies results",
            "it": "NEXUS certifica i risultati",
            "es": "NEXUS certifica los resultados"}},
        {"key": "how_s3_desc",     "field_type": "text",
         "translations": {
            "en": "Both performances are validated. Results are certified. No self-reporting. No disputes.",
            "it": "Entrambe le performance vengono validate. I risultati sono certificati. Nessun auto-report. Nessuna disputa.",
            "es": "Ambos rendimientos son validados. Los resultados son certificados. Sin auto-declaraciones. Sin disputas."}},
        {"key": "how_s4_title",    "field_type": "heading",
         "translations": {
            "en": "K-Rating updates",
            "it": "Il K-Rating si aggiorna",
            "es": "El K-Rating se actualiza"}},
        {"key": "how_s4_desc",     "field_type": "text",
         "translations": {
            "en": "The winner's K-Rating rises. The loser's adjusts. Both results are permanent.",
            "it": "Il K-Rating del vincitore sale. Quello del perdente si aggiusta. Entrambi i risultati sono permanenti.",
            "es": "El K-Rating del ganador sube. El del perdedor se ajusta. Ambos resultados son permanentes."}},
        {"key": "why_badge",       "field_type": "label",
         "translations": {
            "en": "WHY MATCHES MATTER",
            "it": "PERCHÉ LE SFIDE CONTANO",
            "es": "POR QUÉ IMPORTAN LOS DUELOS"}},
        {"key": "why_h2",          "field_type": "heading",
         "translations": {
            "en": "REAL RIVALRY. REAL DATA.",
            "it": "VERA RIVALITÀ. DATI REALI.",
            "es": "RIVALIDAD REAL. DATOS REALES."}},
        {"key": "why_body",        "field_type": "text",
         "translations": {
            "en": "A match is not just a competition. It is a precise measurement instrument. Two athletes. Same challenge. Same conditions. NEXUS validates both. The result is a data point that cannot be contested.",
            "it": "Una sfida non è solo una competizione. È uno strumento di misurazione preciso. Due atleti. Stessa sfida. Stesse condizioni. NEXUS valida entrambi. Il risultato è un dato incontestabile.",
            "es": "Un duelo no es solo una competición. Es un instrumento de medición preciso. Dos atletas. El mismo desafío. Las mismas condiciones. NEXUS valida ambos. El resultado es un dato incontestable."}},
        {"key": "nexus_badge",     "field_type": "label",
         "translations": {
            "en": "NEXUS ENGINE",
            "it": "MOTORE NEXUS",
            "es": "MOTOR NEXUS"}},
        {"key": "nexus_callout",   "field_type": "heading",
         "translations": {
            "en": "NEXUS VALIDATES BOTH ATHLETES.",
            "it": "NEXUS VALIDA ENTRAMBI GLI ATLETI.",
            "es": "NEXUS VALIDA A AMBOS ATLETAS."}},
        {"key": "nexus_body",      "field_type": "text",
         "translations": {
            "en": "Puppet Motion Detection monitors every joint and every rep of both athletes simultaneously. The result is always real.",
            "it": "Il Puppet Motion Detection monitora ogni articolazione e ogni rep di entrambi gli atleti simultaneamente. Il risultato è sempre reale.",
            "es": "El Puppet Motion Detection monitoriza cada articulación y cada rep de ambos atletas simultáneamente. El resultado es siempre real."}},
        {"key": "final_h2",        "field_type": "heading",
         "translations": {
            "en": "ACCEPT THE MATCH.",
            "it": "ACCETTA LA SFIDA.",
            "es": "ACEPTA EL DUELO."}},
        {"key": "final_sub",       "field_type": "text",
         "translations": {
            "en": "NEXUS has assigned a challenge for you. Execute and be measured.",
            "it": "NEXUS ha assegnato una sfida per te. Esegui e vieni misurato.",
            "es": "NEXUS ha asignado un desafío para ti. Ejecuta y sé medido."}},
        {"key": "cta_primary",     "field_type": "cta",
         "translations": {
            "en": "Accept the Match",
            "it": "Accetta la Sfida",
            "es": "Acepta el Duelo"}},
    ],

}

def main():
    parser = argparse.ArgumentParser(description='Seed CMS content to MongoDB')
    parser.add_argument('--slug', help='Page slug to seed (or "all")')
    parser.add_argument('--force', action='store_true', help='Force update even if exists')
    parser.add_argument('--api', default=None, help='API base URL')
    parser.add_argument('--password', default='ArenaKore2026!', help='Admin password')
    parser.add_argument('--list', action='store_true', help='List available slugs')
    args = parser.parse_args()

    if args.list:
        print("Available slugs:")
        for slug in PAGES: print(f"  - {slug}")
        return 0

    api_url = args.api or get_api_url()
    print(f"API: {api_url}")

    try:
        token = admin_login(api_url, args.password)
        print(f"Auth: OK")
    except Exception as e:
        print(f"Auth failed: {e}")
        return 1

    slugs = list(PAGES.keys()) if args.slug == 'all' else [args.slug]

    for slug in slugs:
        if slug not in PAGES:
            print(f"Unknown slug: {slug}. Use --list to see available slugs.")
            continue
        sections = PAGES[slug]
        result = seed_page(api_url, token, slug, sections, force=args.force)
        if result.get('ok'):
            print(f"✓ Seeded {slug} ({len(sections)} sections)")
        else:
            print(f"✗ Failed {slug}: {result.get('error', 'unknown')[:100]}")
            # Try with force if it already exists
            if 'already' in str(result.get('error', '')).lower() and not args.force:
                print(f"  Retrying with --force...")
                result = seed_page(api_url, token, slug, sections, force=True)
                if result.get('ok'):
                    print(f"  ✓ Force-seeded {slug}")

    return 0

if __name__ == '__main__':
    sys.exit(main())
