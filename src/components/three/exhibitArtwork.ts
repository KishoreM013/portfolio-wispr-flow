import * as THREE from 'three'
import type { Exhibit } from '../../data/collection'

/** Original explanatory drawings of the work, not fabricated product screenshots. */
export function createExhibitArtwork(exhibit: Exhibit, index: number) {
  const canvas = document.createElement('canvas'); canvas.width = 1800; canvas.height = 1400
  const c = canvas.getContext('2d')!
  const ink = '#203c35', accent = '#9d7543', blue = '#426f80'
  c.fillStyle = '#e9e1cd'; c.fillRect(0, 0, 1800, 1400)
  c.strokeStyle = '#b3a88e'; c.lineWidth = 2; c.strokeRect(45, 45, 1710, 1310)
  const text = (s: string, x: number, y: number, size = 30, color = ink, font = 'sans-serif') => { c.fillStyle = color; c.font = `${size}px ${font}`; c.fillText(s, x, y) }
  const line = (x: number, y: number, xx: number, yy: number, color = ink) => { c.strokeStyle = color; c.lineWidth = 3; c.beginPath(); c.moveTo(x, y); c.lineTo(xx, yy); c.stroke() }
  const box = (x: number, y: number, w: number, h: number, color = '#d2cbb5') => { c.fillStyle = color; c.fillRect(x, y, w, h) }
  const node = (x: number, y: number, label: string) => { c.fillStyle = ink; c.beginPath(); c.arc(x, y, 32, 0, Math.PI * 2); c.fill(); c.textAlign = 'center'; text(label, x, y + 10, 26, '#fff4d8'); c.textAlign = 'left' }
  text(`THE KISHORE COLLECTION  /  ${String(index + 1).padStart(2, '0')}`, 100, 110, 24, accent)
  text(exhibit.year || exhibit.medium.toUpperCase(), 100, 160, 23, accent)
  const words = exhibit.title.split(' '); let current = '', row = 0
  for (const word of words) { c.font = '66px Georgia'; const next = current ? `${current} ${word}` : word; if (c.measureText(next).width > 1550 && current) { text(current, 100, 260 + row++ * 76, 66, ink, 'Georgia'); current = word } else current = next }
  text(current, 100, 260 + row * 76, 66, ink, 'Georgia')
  line(100, 380, 1700, 380, '#b3a88e')
  if (exhibit.id === 'legal') {
    for (let page = 0; page < 3; page++) {
      const x = 140 + page * 450, y = 440 + page * 45
      box(x, y, 350, 480, '#f9f2df'); c.strokeStyle = '#c6baa0'; c.strokeRect(x, y, 350, 480)
      text(['THE CONTRACT', 'RETRIEVED CLAUSES', 'GROUNDED INSIGHTS'][page], x + 24, y + 52, 20, accent)
      for (let i = 0; i < 8; i++) { if (i === 3 || i === 4) box(x + 22, y + 98 + i * 35, 300, 24, '#c7d6bd'); line(x + 24, y + 112 + i * 35, x + 280 - i % 3 * 35, y + 112 + i * 35, '#899084') }
    }
    text('ASK  →  RETRIEVE  →  LOCAL INFERENCE  →  EXPLAIN', 150, 1090, 32, blue)
    text('Text · PDF · Web · Image     /     7+ languages     /     On-device processing', 150, 1150, 26)
  } else if (exhibit.id === 'tgk' || exhibit.id === 'teaching') {
    text('FROM AN IDEA TO A STRUCTURE', 130, 455, 25, accent)
    for (let i = 0; i < 6; i++) { box(135 + i * 190, 510, 165, 95, i % 2 ? '#c7d1be' : '#d7c6a5'); text(String((i + 1) * 7), 185 + i * 190, 573, 40, ink, 'Georgia'); text(`[${i}]`, 190 + i * 190, 648, 24, accent) }
    const points = [[480, 770], [290, 920], [670, 920], [180, 1080], [400, 1080], [800, 1080]]
    for (const [a, b] of [[0, 1], [0, 2], [1, 3], [1, 4], [2, 5]]) line(...points[a] as [number, number], ...points[b] as [number, number], blue)
    points.forEach(([x, y], i) => node(x, y, String(i + 1)))
    text(exhibit.id === 'teaching' ? 'C PROGRAMMING' : 'SIX INTERACTIVE PLAYGROUNDS', 1030, 820, 27, accent)
    text('Understand the structure.', 1030, 895, 37, ink, 'Georgia'); text('See the operation.', 1030, 955, 37, ink, 'Georgia'); text('Learn the complexity.', 1030, 1015, 37, ink, 'Georgia')
  } else if (exhibit.id === 'film') {
    for (let frame = 0; frame < 3; frame++) {
      const x = 120 + frame * 540
      box(x, 480, 480, 470, '#4b6150')
      for (let i = 0; i < 20; i++) { const xx = x + 14 + i % 5 * 92, yy = 495 + Math.floor(i / 5) * 110; box(xx, yy, 80, 96, ['#697552', '#84906c', '#a29b71', '#566d59'][(i + frame) % 4]) }
      for (let i = 0; i < 3; i++) line(x + 70 + i * 130 + frame * 6, 480, x + 100 + i * 130, 950, '#c2b898')
      text(['FIRST FRAME', 'IN-BETWEEN FRAME', 'LAST FRAME'][frame], x, 1010, 27, accent)
    }
    text('A STUDY IN TEMPORAL CONTINUITY', 120, 1120, 32, blue)
    text('FILM-inspired model · Satellite imagery · PyTorch / CUDA', 120, 1180, 27)
  } else if (exhibit.id === 'chess' || exhibit.id === 'research') {
    for (let y = 0; y < 8; y++) for (let x = 0; x < 8; x++) box(140 + x * 75, 465 + y * 75, 75, 75, (x + y) % 2 ? '#586a55' : '#d4caaf')
    c.textAlign = 'center'; text('♜', 252, 620, 65); text('♞', 477, 845, 65); text('♔', 627, 1070, 65); c.textAlign = 'left'
    text('THE NEXT MOVE', 920, 560, 29, accent); text('Observe.', 920, 690, 65, ink, 'Georgia'); text('Evaluate.', 920, 780, 65, ink, 'Georgia'); text('Decide.', 920, 870, 65, ink, 'Georgia')
    text('A comparison of decision-making approaches', 920, 1000, 25)
  } else if (exhibit.id === 'tgk-editor') {
    box(120, 470, 1560, 620, '#1d2928'); box(160, 510, 420, 540, '#293b39'); box(610, 510, 1010, 540, '#243331')
    text('PROJECT', 190, 570, 20, '#d7bd7b'); text('FILES', 190, 620, 25, '#e8dfc9')
    ;['main.cpp', 'editor.cpp', 'CMakeLists.txt', 'README.md'].forEach((label, i) => text(label, 205, 690 + i * 58, 24, i === 1 ? '#edcf82' : '#b7c9bd'))
    text('int main() {', 670, 610, 30, '#d7bd7b', 'monospace'); text('  editor.open();', 670, 665, 30, '#bdd6c4', 'monospace'); text('  build_and_run();', 670, 720, 30, '#a7c7d2', 'monospace'); text('}', 670, 775, 30, '#d7bd7b', 'monospace')
    text('CLANGD  /  F9 RUN  /  QT6', 670, 970, 25, '#d7bd7b')
  } else if (exhibit.id === 'codetgk') {
    text('APPROVAL REQUIRED', 140, 500, 24, accent); const stages = ['PLAN', 'IMPLEMENT', 'TEST', 'REVIEW']
    stages.forEach((stage, i) => { const x = 170 + i * 390; c.fillStyle = i === 1 ? '#b9cbb9' : '#d8c49b'; c.beginPath(); c.arc(x, 790, 125, 0, Math.PI * 2); c.fill(); text(String(i + 1).padStart(2, '0'), x - 20, 750, 30, accent); c.textAlign = 'center'; text(stage, x, 820, 27, ink, 'Georgia'); c.textAlign = 'left'; if (i < stages.length - 1) line(x + 135, 790, x + 250, 790, blue) })
    text('READ  ·  WRITE  ·  SEARCH  ·  SHELL  ·  GIT', 170, 1050, 28, blue); text('A deliberate terminal workflow', 170, 1140, 38, ink, 'Georgia')
  } else if (exhibit.id === 'sovereignopt') {
    box(145, 470, 700, 570, '#243e3c'); box(900, 470, 700, 570, '#d4c7a6')
    text('CPU', 205, 550, 28, '#e5c779'); text('GPU / CUDA', 960, 550, 28, '#426f80')
    for (let i = 0; i < 5; i++) { line(220, 650 + i * 65, 750, 650 + i * 65, '#91a99a'); line(980, 650 + i * 65, 1510, 650 + i * 65, '#9d7543') }
    ;[[260, 650], [440, 780], [650, 910]].forEach(([x, y]) => node(x, y, 'x')); [[1020, 650], [1250, 780], [1450, 910]].forEach(([x, y]) => node(x, y, 'Δ'))
    text('LP  ·  MILP  ·  QP', 145, 1140, 32, blue); text('KKT VERIFIED', 1200, 1140, 32, accent)
  } else if (exhibit.id === 'smart-email') {
    box(130, 450, 1540, 650, '#d2d7c6'); box(180, 510, 360, 530, '#263a35'); box(590, 510, 1020, 90, '#eee7d5')
    text('INBOX', 220, 580, 25, '#edcf82'); ['Important', 'Meetings', 'Attachments', 'Replies'].forEach((label, i) => text(label, 220, 680 + i * 70, 25, i === 0 ? '#f0d48d' : '#b9cbb9'))
    text('Prepare Q3 review', 650, 565, 31, ink, 'Georgia'); text('priority: HIGH', 650, 690, 25, '#9d4c3f'); text('Friday · 4:00 PM', 650, 770, 28, blue); text('PDF attachment scanned', 650, 850, 28, ink); text('DRAFT REPLY  →  SCHEDULE', 650, 980, 26, accent)
  } else if (exhibit.id === 'github-analyzer') {
    c.strokeStyle = '#426f80'; c.lineWidth = 12; c.beginPath(); c.arc(510, 790, 260, 0, Math.PI * 2); c.stroke()
    ;[[510, 530], [350, 850], [670, 850], [510, 790]].forEach(([x, y], i) => node(x, y, i === 3 ? 'K' : '•'))
    line(510, 530, 510, 790, blue); line(350, 850, 510, 790, blue); line(670, 850, 510, 790, blue)
    text('PROFILE  →  REPOSITORIES  →  SIGNALS', 920, 700, 31, accent); text('Public GitHub activity, made legible.', 920, 820, 38, ink, 'Georgia')
  } else if (exhibit.id === 'github') {
    box(130, 450, 1540, 650, '#202a2d'); text('GITHUB', 190, 545, 30, '#f0d48d'); text('KishoreM013', 190, 650, 68, '#f4eee0', 'Georgia')
    text('AI & Data Science · builder', 190, 720, 28, '#b7c9bd'); ['tgk-editor', 'codetgk-opencode', 'SovereignOpt'].forEach((label, i) => { box(840, 535 + i * 155, 650, 100, i === 1 ? '#38534d' : '#2c3b3d'); text(label, 880, 595 + i * 155, 28, '#f0d48d'); text('repository · public work', 880, 635 + i * 155, 20, '#b7c9bd') })
    text('CODE · EXPERIMENTS · OPEN SOURCE', 190, 965, 27, '#9cc5b3')
  } else if (exhibit.id === 'linkedin') {
    box(130, 450, 1540, 650, '#d7e4e6'); box(130, 450, 1540, 125, '#2b6f88'); c.fillStyle = '#e9e1cd'; c.beginPath(); c.arc(340, 650, 110, 0, Math.PI * 2); c.fill()
    text('in', 300, 690, 90, '#2b6f88', 'Georgia'); text('Kishore Mohan', 540, 690, 52, ink, 'Georgia'); text('Software engineer · AI & Data Science', 540, 755, 28, blue); text('Chennai Institute of Technology', 540, 815, 24, ink)
    text('EXPERIENCE', 190, 970, 23, accent); text('Projects · research · engineering practice', 190, 1020, 30, ink)
  } else if (exhibit.id === 'leetcode') {
    text('LEETCODE', 140, 485, 34, '#d9823b'); text('KISHORE_M_13', 140, 565, 52, ink, 'Georgia'); text('KNIGHT', 140, 625, 25, '#b76a2a')
    ;[['1,000+', 'problems solved'], ['1903', 'maximum rating'], ['Top 7.48%', 'global standing']].forEach(([value, label], i) => { const x = 170 + i * 500; box(x, 740, 390, 180, i === 1 ? '#f0c98e' : '#e8d9bd'); text(value, x + 35, 820, 43, ink, 'Georgia'); text(label, x + 35, 865, 23, accent) })
    text('TEN BADGES  ·  ALGORITHM PRACTICE  ·  RÉSUMÉ SNAPSHOT', 140, 1060, 26, blue)
  } else if (exhibit.id === 'codeforces') {
    box(130, 450, 1540, 650, '#eef0e8'); text('CODEFORCES', 180, 535, 29, '#3c6f9c'); text('kishoremohan1307', 180, 620, 52, ink, 'Georgia'); text('PUPIL', 180, 680, 25, '#3c6f9c')
    line(300, 980, 1480, 980, blue); line(300, 980, 420, 880, blue); line(420, 880, 650, 910, blue); line(650, 910, 870, 750, blue); line(870, 750, 1110, 790, blue); line(1110, 790, 1380, 620, blue)
    text('1295', 1210, 560, 62, ink, 'Georgia'); text('maximum rating', 1210, 610, 22, accent); text('70+ problems · contest practice', 180, 1040, 26, ink)
  } else if (exhibit.id === 'codechef') {
    box(130, 450, 1540, 650, '#fff0e2'); text('CODECHEF', 180, 540, 32, '#b94327'); text('kishore_m13', 180, 620, 52, ink, 'Georgia'); text('3 STAR', 180, 680, 26, '#b94327')
    ;['1st / 191', '1670 max rating', '240 problems'].forEach((label, i) => { c.fillStyle = '#b94327'; c.beginPath(); c.arc(420 + i * 370, 850, 105, 0, Math.PI * 2); c.fill(); c.textAlign = 'center'; text(label, 420 + i * 370, 865, 26, '#fff5e8', 'Georgia'); c.textAlign = 'left' })
    text('MACHINE LEARNING CONTEST  ·  STARters 172: 514', 180, 1035, 24, accent)
  } else if (exhibit.id === 'gfg') {
    box(130, 450, 1540, 650, '#edf4e7'); text('GeeksforGeeks', 180, 555, 42, '#2f8d46', 'Georgia'); text('kishoremodai8', 180, 630, 48, ink, 'Georgia')
    ;['Data Structures', 'Algorithms', 'Problem Solving'].forEach((label, i) => { const x = 220 + i * 460; c.fillStyle = '#2f8d46'; c.beginPath(); c.arc(x, 850, 112, 0, Math.PI * 2); c.fill(); text(String(i + 1).padStart(2, '0'), x - 25, 840, 33, '#f0f7df', 'Georgia'); text(label, x - 105, 1005, 22, ink) })
    text('PRACTICE PROFILE  ·  CURRENT SCORES LIVE ON PROFILE', 180, 1060, 23, '#477a4d')
  } else if (exhibit.id === 'hackerrank') {
    box(130, 450, 1540, 650, '#18261f'); text('HACKERRANK', 180, 545, 32, '#72d572'); text('kishorem_aids07', 180, 625, 50, '#f3ead9', 'Georgia')
    ;['C', 'PY', 'SQL', 'AI'].forEach((label, i) => { const x = 270 + i * 350; c.fillStyle = i === 2 ? '#c9a35e' : '#3f7f5a'; c.beginPath(); c.arc(x, 850, 95, 0, Math.PI * 2); c.fill(); c.textAlign = 'center'; text(label, x, 865, 34, '#f3ead9', 'Georgia'); c.textAlign = 'left' })
    text('SKILLS  ·  BADGES  ·  CHALLENGES', 180, 1050, 27, '#a8d7a7')
  } else if (exhibit.id === 'instagram') {
    box(130, 450, 1540, 650, '#efe0d5'); c.strokeStyle = '#bd5d75'; c.lineWidth = 18; c.strokeRect(250, 560, 300, 300); c.fillStyle = '#bd5d75'; c.beginPath(); c.arc(400, 710, 72, 0, Math.PI * 2); c.stroke(); c.beginPath(); c.arc(490, 620, 18, 0, Math.PI * 2); c.fill()
    text('INSTAGRAM', 760, 600, 32, '#bd5d75'); text('@tgk_prime', 760, 700, 56, ink, 'Georgia'); text('THE PERSONAL LENS', 760, 780, 25, accent); text('Code · life · moments beyond the repository', 760, 860, 27, ink)
  } else if (exhibit.id === 'youtube') {
    box(130, 450, 1540, 650, '#f2dfd9'); c.fillStyle = '#c8372d'; c.beginPath(); c.roundRect(250, 610, 380, 250, 35); c.fill(); c.fillStyle = '#fff4e5'; c.beginPath(); c.moveTo(410, 675); c.lineTo(410, 795); c.lineTo(520, 735); c.closePath(); c.fill()
    text('YouTube', 810, 610, 37, '#c8372d'); text('@tgkprim3', 810, 710, 56, ink, 'Georgia'); text('THE VIDEO CHANNEL', 810, 790, 25, accent); text('Build logs · ideas · experiments', 810, 870, 29, ink)
  } else if (exhibit.id === 'kaggle') {
    box(130, 450, 1540, 650, '#e2f0f4'); text('KAGGLE', 180, 550, 35, '#2084a5'); text('kishoremohan013', 180, 630, 50, ink, 'Georgia'); text('NOTEBOOKS', 180, 735, 25, '#2084a5')
    ;[0, 1, 2].forEach(i => { box(720 + i * 270, 570, 210, 300, i === 1 ? '#c1dfe8' : '#f5f0df'); text(['DATA', 'MODEL', 'RESULT'][i], 750 + i * 270, 650, 25, accent); line(750 + i * 270, 720, 880 + i * 270, 720, blue); line(750 + i * 270, 770, 850 + i * 270, 770, blue) })
    text('DATA SCIENCE  ·  NOTEBOOKS  ·  EXPERIMENTS', 180, 1030, 26, blue)
  } else if (exhibit.id === 'huggingface') {
    box(130, 450, 1540, 650, '#eee7d4'); text('HUGGING FACE', 180, 550, 35, '#8a5fb7'); text('ki5h0r3', 180, 630, 55, ink, 'Georgia'); text('MODEL SHELF', 180, 710, 25, '#8a5fb7')
    ;['MODELS', 'DATASETS', 'SPACES'].forEach((label, i) => { box(210 + i * 470, 820, 360, 150, i === 1 ? '#d9c8ea' : '#e4d7ba'); text(label, 260 + i * 470, 905, 29, ink, 'Georgia') })
    text('AI COMMUNITY PROFILE  ·  PUBLIC EXPERIMENTS', 180, 1050, 25, accent)
  } else if (exhibit.id === 'stackoverflow') {
    box(130, 450, 1540, 650, '#f5eee4'); text('STACK OVERFLOW', 180, 550, 34, '#bc5b25'); text('Kishore Mohan', 180, 630, 53, ink, 'Georgia'); text('USER 23596737', 180, 690, 23, '#bc5b25')
    ;['Questions', 'Answers', 'Tags'].forEach((label, i) => { box(210 + i * 470, 790, 360, 140, i === 1 ? '#d9e3d3' : '#ead7b7'); text(label, 255 + i * 470, 875, 28, ink, 'Georgia') })
    text('TECHNICAL KNOWLEDGE  ·  COMMUNITY CONTRIBUTIONS', 180, 1040, 24, accent)
  } else if (exhibit.id === 'legacy-just-another-day' || exhibit.id === 'worst-phase') {
    box(130, 450, 1540, 650, exhibit.id === 'legacy-just-another-day' ? '#e5ddd0' : '#d8e0d8')
    text('MEDIUM', 180, 555, 28, '#477a6a'); text('KISHOREMOHAN1307', 180, 620, 25, accent)
    text(exhibit.id === 'legacy-just-another-day' ? 'MEMORY / LOSS / HOPE' : 'LONELINESS / RESILIENCE / KINDNESS', 180, 760, 30, ink)
    for (let i = 0; i < 5; i++) { line(190, 850 + i * 42, 1400 - i * 80, 850 + i * 42, i === 2 ? '#9d7543' : '#8aa095') }
    text('PERSONAL ESSAY', 180, 1080, 27, '#477a6a')
  } else if (exhibit.id === 'its-our-show' || exhibit.id === 'a-lifes-echoes' || exhibit.id === 'unwritten-endings' || exhibit.id === 'anchor-slips') {
    box(130, 450, 1540, 650, exhibit.id === 'anchor-slips' ? '#d9d3c4' : '#e5d6c3')
    c.fillStyle = exhibit.id === 'unwritten-endings' ? '#526c63' : '#9d7543'; c.beginPath(); c.arc(510, 770, 210, 0, Math.PI * 2); c.fill()
    c.strokeStyle = '#f0e2c5'; c.lineWidth = 5
    for (let i = 0; i < 4; i++) { c.beginPath(); c.arc(510, 770, 70 + i * 43, 0, Math.PI * 2); c.stroke() }
    text('YOUTUBE', 850, 575, 27, '#b94327'); text('TGK PRIME', 850, 635, 25, accent)
    text(exhibit.id === 'its-our-show' ? 'ALL BETWEEN US' : exhibit.id === 'a-lifes-echoes' ? 'A LIFE’S ECHOES' : exhibit.id === 'unwritten-endings' ? 'UNWRITTEN ENDINGS' : 'ANCHOR SLIPS', 850, 790, 40, ink, 'Georgia')
    text(exhibit.id === 'anchor-slips' ? 'LYRICS BY TGK  ·  MUSIC BY GEMINI' : 'LYRICS BY TGK  ·  MUSIC BY AI', 850, 900, 24, blue)
    text('ORIGINAL SONG', 850, 1010, 27, '#b94327')
  } else if (exhibit.id === 'write-songs') {
    box(140, 450, 1520, 650, '#efe2c7')
    c.strokeStyle = '#426f80'; c.lineWidth = 5
    for (let i = 0; i < 5; i++) line(180, 600 + i * 58, 1580, 600 + i * 58, '#78949a')
    ;[[330, 600], [520, 716], [760, 658], [1060, 774], [1320, 658]].forEach(([x, y], i) => { c.fillStyle = i % 2 ? '#9d7543' : '#526c63'; c.beginPath(); c.arc(x, y, 24, 0, Math.PI * 2); c.fill(); line(x + 24, y, x + 24, y - 150, '#203c35') })
    text('VERSE  /  CHORUS  /  FEELING', 180, 980, 30, accent); text('A page becomes a melody.', 180, 1050, 48, ink, 'Georgia')
  } else if (exhibit.id === 'listen-songs') {
    box(140, 450, 1520, 650, '#d7e0d7')
    c.fillStyle = '#293b39'; c.beginPath(); c.arc(510, 770, 250, 0, Math.PI * 2); c.fill()
    c.strokeStyle = '#d7bd7b'; c.lineWidth = 7; [55, 105, 155].forEach(r => { c.beginPath(); c.arc(510, 770, r, 0, Math.PI * 2); c.stroke() })
    c.fillStyle = '#d7bd7b'; c.beginPath(); c.arc(510, 770, 35, 0, Math.PI * 2); c.fill()
    text('PLAYLIST FOR THE DAY', 900, 640, 32, accent); text('listen / reset / repeat', 900, 760, 52, ink, 'Georgia'); text('A soundtrack for every mood.', 900, 900, 29, blue)
  } else if (exhibit.id === 'singing') {
    box(140, 450, 1520, 650, '#ead6d0')
    c.fillStyle = '#526c63'; c.beginPath(); c.arc(540, 700, 110, 0, Math.PI * 2); c.fill()
    c.fillStyle = '#d7bd7b'; c.fillRect(510, 700, 60, 300); c.fillRect(475, 980, 130, 22)
    c.strokeStyle = '#b94327'; c.lineWidth = 9; c.beginPath(); c.arc(540, 700, 185, -.8, .8); c.stroke(); c.beginPath(); c.arc(540, 700, 250, -.65, .65); c.stroke()
    text('SING WITH CONFIDENCE', 880, 660, 34, accent); text('Usually on-key.', 880, 780, 54, ink, 'Georgia'); text('Always committed.', 880, 890, 42, blue, 'Georgia')
  } else if (exhibit.id === 'minecraft') {
    box(140, 450, 1520, 650, '#b9d1c8')
    const blocks = ['#6c8b58', '#8e6e4b', '#a8a35d', '#526f62', '#c4aa69']
    for (let y = 0; y < 4; y++) for (let x = 0; x < 8; x++) box(230 + x * 135, 560 + y * 110, 125, 100, blocks[(x + y * 2) % blocks.length])
    text('BUILD  /  EXPLORE  /  GET LOST', 230, 1040, 33, ink); text('One block at a time.', 1010, 720, 48, '#fff4d8', 'Georgia')
  } else if (exhibit.id === 'learning-new-things') {
    c.strokeStyle = '#426f80'; c.lineWidth = 5
    const points = [[270, 900], [530, 620], [850, 820], [1140, 560], [1460, 880]]
    for (let i = 0; i < points.length - 1; i++) line(...points[i] as [number, number], ...points[i + 1] as [number, number], blue)
    points.forEach(([x, y], i) => { c.fillStyle = i === 2 ? '#b94327' : '#526c63'; c.beginPath(); c.arc(x, y, 48, 0, Math.PI * 2); c.fill(); text(String(i + 1), x - 10, y + 12, 28, '#fff4d8') })
    text('NEW QUESTION', 220, 520, 31, accent); text('NEW TOOL', 720, 520, 31, accent); text('NEW RABBIT HOLE', 1200, 520, 31, accent)
  } else if (exhibit.id === 'chatting-with-friends') {
    box(140, 450, 1520, 650, '#e5ddd0')
    ;[[280, 600, '#526c63'], [950, 570, '#9d7543'], [480, 850, '#78949a'], [1160, 850, '#b94327']].forEach(([x, y, color], i) => { c.fillStyle = color as string; c.beginPath(); c.roundRect(x as number, y as number, 390, 150, 35); c.fill(); c.fillStyle = color as string; c.beginPath(); c.moveTo((x as number) + 60, (y as number) + 145); c.lineTo((x as number) + 25, (y as number) + 205); c.lineTo((x as number) + 120, (y as number) + 150); c.fill(); text(['hello', 'idea!', 'haha', 'one more thing'][i], (x as number) + 45, (y as number) + 92, 34, '#fff4d8', 'Georgia') })
    text('THE SOCIAL DEBUGGER', 220, 1020, 34, ink); text('Good conversations keep the system running.', 220, 1080, 28, blue)
  } else if (exhibit.id === 'watching-movies') {
    box(140, 450, 1520, 650, '#252d30')
    c.fillStyle = '#d7bd7b'; c.beginPath(); c.roundRect(250, 570, 570, 350, 28); c.fill(); c.fillStyle = '#526c63'; c.beginPath(); c.moveTo(500, 650); c.lineTo(500, 840); c.lineTo(700, 745); c.closePath(); c.fill()
    text('FUNNY', 980, 620, 35, '#d7bd7b'); text('ROM-COM', 980, 750, 35, '#e5b3a5'); text('EPIC', 980, 880, 35, '#9cc5b3'); text('three ways to escape for two hours', 980, 1010, 25, '#f0e2c5')
  } else if (exhibit.id === 'searching-the-web') {
    c.strokeStyle = '#426f80'; c.lineWidth = 18; c.beginPath(); c.arc(510, 720, 180, 0, Math.PI * 2); c.stroke(); line(645, 855, 820, 1030, '#9d7543')
    ;[[1040, 620], [1340, 760], [1080, 980], [1480, 1000]].forEach(([x, y]) => { c.fillStyle = '#526c63'; c.beginPath(); c.arc(x, y, 26, 0, Math.PI * 2); c.fill(); line(536, 690, x, y, '#b3a88e') })
    text('SEARCH', 920, 540, 34, accent); text('click / discover / wonder', 920, 680, 46, ink, 'Georgia')
  } else if (exhibit.id === 'overthinking') {
    c.strokeStyle = '#9d7543'; c.lineWidth = 8; c.beginPath(); c.moveTo(250, 800)
    for (let i = 0; i < 40; i++) c.bezierCurveTo(450 + i * 12, 500 + Math.sin(i) * 260, 850 + i * 8, 980 - Math.cos(i) * 250, 1550 - i * 10, 800)
    c.stroke(); text('WHAT IF?', 230, 560, 62, ink, 'Georgia'); text('a premium subscription to thinking in circles', 230, 1040, 30, blue)
  } else if (exhibit.id === 'manipulating') {
    box(140, 450, 1520, 650, '#e1d6c1')
    ;[[420, 760, '#526c63'], [700, 640, '#b94327'], [980, 820, '#9d7543'], [1280, 650, '#426f80']].forEach(([x, y, color]) => { c.fillStyle = color as string; c.beginPath(); c.arc(x as number, y as number, 75, 0, Math.PI * 2); c.fill() })
    line(495, 730, 625, 675, '#203c35'); line(775, 680, 905, 785, '#203c35'); line(1055, 770, 1205, 690, '#203c35')
    text('MOVE THE PIECES', 220, 1000, 38, ink); text('with honesty, consent and a little mischief', 220, 1070, 27, blue)
  } else if (exhibit.id === 'contact') {
    box(130, 450, 1540, 650, '#e9e1cd'); text('CORRESPONDENCE', 180, 550, 28, accent); text('Kishore Mohan', 180, 650, 58, ink, 'Georgia'); line(180, 730, 1500, 730, '#b3a88e'); text('Engineering · AI · collaboration', 180, 820, 30, blue); text('Chennai, India', 180, 900, 28, ink); text('kishoremohan1307@gmail.com', 180, 980, 27, ink)
  } else {
    const labels = exhibit.id === 'feedback' ? ['CUSTOMER VOICE', 'CLASSIFY', 'SUGGEST IMPROVEMENTS'] : exhibit.id === 'microsoft' ? ['SERVICE SIGNALS', 'DETECT ANOMALIES', 'AUTOMATE RESPONSE'] : exhibit.id === 'spam' ? ['INCOMING EMAIL', 'COMPACT CLASSIFIER', 'SPAM / LEGITIMATE'] : ['PRACTICE', 'BUILD', 'SHARE']
    labels.forEach((label, i) => {
      const x = 140 + i * 540
      box(x, 530, 450, 270, i % 2 ? '#c6d0be' : '#d8c8a7')
      text(String(i + 1).padStart(2, '0'), x + 30, 600, 38, accent, 'Georgia')
      text(label, x + 30, 710, 23)
      if (i < 2) { line(x + 465, 665, x + 520, 665, blue); line(x + 505, 650, x + 520, 665, blue); line(x + 505, 680, x + 520, 665, blue) }
    })
    text(exhibit.subtitle, 140, 950, 40, ink, 'Georgia')
    const words = exhibit.description.split(' '); let lineText = '', row = 0
    for (const word of words) { c.font = '29px sans-serif'; const next = lineText + word + ' '; if (c.measureText(next).width > 1450) { text(lineText, 140, 1040 + row++ * 43, 29); lineText = word + ' ' } else lineText = next }
    text(lineText, 140, 1040 + row * 43, 29)
  }
  line(100, 1250, 1700, 1250, '#b3a88e')
  text(exhibit.metric || 'A study from the personal collection', 100, 1315, 36, ink, 'Georgia')
  c.textAlign = 'right'; text('EXPLANATORY STUDY · RÉSUMÉ COLLECTION', 1700, 1315, 19, accent)
  const texture = new THREE.CanvasTexture(canvas); texture.colorSpace = THREE.SRGBColorSpace; texture.anisotropy = 8
  return texture
}
