with open('src/components/BottomNav.tsx', 'r') as f:
    text = f.read()

import re
text = re.sub(r'const isApps = item\.id === \'apps\';', 'const isApps = (item.id as string) === \'apps\';', text)
text = re.sub(r'if \(item\.id === \'apps\'\)', 'if ((item.id as string) === \'apps\')', text)

with open('src/components/BottomNav.tsx', 'w') as f:
    f.write(text)
