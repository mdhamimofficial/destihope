with open('src/components/BottomNav.tsx', 'r') as f:
    text = f.read()

text = text.replace("    {      id: 'apps' as ActiveModule,", "    {      id: 'apps' as any,")
with open('src/components/BottomNav.tsx', 'w') as f:
    f.write(text)
