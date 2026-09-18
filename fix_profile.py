with open('src/components/modules/DestiProfileView.tsx', 'r') as f:
    lines = f.readlines()

for i, line in enumerate(lines):
    if 'return (' in line:
        start_idx = i
        break

# count <div and </div
open_divs = 0
close_divs = 0
for line in lines[start_idx:]:
    open_divs += line.count('<div')
    close_divs += line.count('</div')

print(f"Open: {open_divs}, Close: {close_divs}")
