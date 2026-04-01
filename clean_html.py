import re

with open('web-deepcrack/index.html', 'r', encoding='utf-8') as f:
    lines = f.readlines()

new_lines = []
in_html_comment = False
in_css_comment = False

for line in lines:
    
    if '<!--' in line and '-->' in line:
        line = re.sub(r'<!--.*?-->', '', line)
    
    if '/*' in line and '*/' in line:
        line = re.sub(r'/\*.*?\*/', '', line)

    if '// ' in line or '// ──' in line:
        line = re.sub(r'//[ ─].*$', '', line)
        if not line.strip():
            continue

    # Remove Emojis
    emojis_to_remove = ['🛣️', '📷', '📋', '⚙️', '🔍', '✅', '⚠️', '🟡', '🔴', '💡', '🟢', '📥', '🔄']
    for em in emojis_to_remove:
        line = line.replace(em, '')
    
    # Replace AI words
    line = line.replace('AI анализ', 'Анализ')
    line = line.replace('AI-анализом', 'анализом')
    line = line.replace('AI Road Monitor', 'Road Monitor')
    line = line.replace('Анализ через Groq Vision AI', 'Обработка данных')
    
    new_lines.append(line)

with open('web-deepcrack/index.html', 'w', encoding='utf-8') as f:
    f.writelines(new_lines)
