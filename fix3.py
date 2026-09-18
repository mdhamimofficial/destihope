with open('src/components/modules/DestiProfileView.tsx', 'r') as f:
    text = f.read()
import re
text = re.sub(r'  \);\n};.*$', '  );\n};\n', text, flags=re.DOTALL)
text = re.sub(r'(      </div>\n    </div>\n).*$', r'\1  );\n};\n', text, flags=re.DOTALL)
with open('src/components/modules/DestiProfileView.tsx', 'w') as f:
    f.write(text)
