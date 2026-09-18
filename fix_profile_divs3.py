with open('src/components/modules/DestiProfileView.tsx', 'r') as f:
    text = f.read()

import re
text = re.sub(r'        </div>\n      </div>\n    </div>\n  </div>\n  \);\n};\n?$', '  );\n};\n', text)
text = re.sub(r'      </div>\n    </div>\n  \);\n};\n?$', '  );\n};\n', text)
text = re.sub(r'    </div>\n  \);\n};\n?$', '  );\n};\n', text)

with open('src/components/modules/DestiProfileView.tsx', 'w') as f:
    f.write(text)
