with open('src/components/modules/DestiProfileView.tsx', 'r') as f:
    text = f.read()
import re
text = re.sub(r'  \);\n};', '    </div>\n  );\n};', text)
with open('src/components/modules/DestiProfileView.tsx', 'w') as f:
    f.write(text)
