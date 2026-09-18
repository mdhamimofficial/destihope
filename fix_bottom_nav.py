with open('src/components/BottomNav.tsx', 'r') as f:
    text = f.read()

import re
text = text.replace('import { Home, MessageCircle, PlaySquare, Brain, Droplet, UserSearch } from \'lucide-react\';', "import { Home, MessageCircle, PlaySquare, Brain, Droplet, UserSearch, LayoutGrid } from 'lucide-react';")

text = text.replace('  unreadChatCount?: number;\n}', '  unreadChatCount?: number;\n  onOpenModuleSwitcher?: () => void;\n}')

text = text.replace('  unreadChatCount = 2,\n}) => {', '  unreadChatCount = 2,\n  onOpenModuleSwitcher,\n}) => {')

text = text.replace("    {      id: 'brain' as ActiveModule,", "    {      id: 'apps' as ActiveModule,      label: 'Apps',      icon: LayoutGrid,      badge: undefined,    },    {      id: 'brain' as ActiveModule,")

text = text.replace("              onClick={() => onSelectModule(item.id)}", "              onClick={() => {                if (item.id === 'apps') {                  if (onOpenModuleSwitcher) onOpenModuleSwitcher();                } else {                  onSelectModule(item.id);                }              }}")

text = text.replace("          const isActive = activeModule === item.id;", "          const isActive = activeModule === item.id;\n          const isApps = item.id === 'apps';")

text = text.replace('              <div className="relative">                <Icon                  className={`w-6 h-6 transition-colors ${                    isActive                      ? \'text-[#E53935] stroke-[2.4]\'                      : \'text-gray-900 stroke-[1.8] hover:text-gray-600\'                  }`}                />                {item.badge && (                  <span className="absolute -top-1 -right-2 bg-red-600 text-white text-[9px] font-black rounded-full px-1 py-0.2">                    {item.badge}                  </span>                )}              </div>', '              <div className="relative">                {isApps ? (                  <div className="w-12 h-12 -mt-6 bg-gradient-to-br from-gray-900 to-gray-800 text-white rounded-full flex items-center justify-center shadow-lg border-4 border-white">                    <Icon className="w-6 h-6" />                  </div>                ) : (                  <>                    <Icon                      className={`w-6 h-6 transition-colors ${                        isActive                          ? \'text-[#E53935] stroke-[2.4]\'                          : \'text-gray-900 stroke-[1.8] hover:text-gray-600\'                      }`}                    />                    {item.badge && (                      <span className="absolute -top-1 -right-2 bg-red-600 text-white text-[9px] font-black rounded-full px-1 py-0.2">                        {item.badge}                      </span>                    )}                  </>                )}              </div>')

with open('src/components/BottomNav.tsx', 'w') as f:
    f.write(text)
