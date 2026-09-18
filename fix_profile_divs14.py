with open('src/components/modules/DestiProfileView.tsx', 'r') as f:
    text = f.read()

import re
text = re.sub(r'  return \(\n    <div className="bg-gray-50 flex-1 flex flex-col h-full relative">\n      \{\/\* Top Header \*\/\}', '  return (\n    <div className="bg-gray-50 flex-1 flex flex-col h-full relative min-h-screen overflow-y-auto pb-24">\n      {/* Top Header */}', text)

with open('src/components/modules/DestiProfileView.tsx', 'w') as f:
    f.write(text)
