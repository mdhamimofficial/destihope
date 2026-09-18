with open('src/components/modules/DestiProfileView.tsx', 'r') as f:
    text = f.read()
text = text.replace('  );\n};', '        </div>\n      </div>\n    </div>\n  </div>\n  );\n};')
with open('src/components/modules/DestiProfileView.tsx', 'w') as f:
    f.write(text)
