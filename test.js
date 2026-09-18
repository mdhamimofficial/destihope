const MODULES = [
    { id: 'chat', label: 'Chat' },
    { id: 'media', label: 'Media'},
    { id: 'brain', label: 'Brain'},
    { id: 'care', label: 'Care'},
    { id: 'find', label: 'Find'},
];
console.log(MODULES.filter(m => m.id !== 'chat'));
