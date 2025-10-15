// ========================================
// DATA STRUCTURE & CONSTANTS
// ========================================

// Hardcoded list of projects
const PROJECTS = [
    { id: 'wts', name: 'WTS', color: '#3b82f6' },
    { id: 'hoerzu/tvdigital', name: 'Hoerzu / TVDigital', color: '#10b981' },
    { id: 'schoenklinik', name: 'Schön Klinik', color: '#8b5cf6' },
    { id: 'caritas', name: 'Caritas', color: '#f59e0b' },
    { id: 'metrohm', name: 'Metrohm', color: '#ef4444' },
    { id: 'kontron', name: 'Kontron', color: '#ec4899' }
];

// Predefined checklist items for each category (general)
const PREDEFINED_ITEMS = {
    uiux: [
        'Visual design matches requirements',
        'UI elements are clearly visible and accessible',
        'User interactions feel intuitive',
        'No visual bugs or glitches',
        'Accessibility for feature verified'
    ],
    functionality: [
        'The feature works as described in the ticket',
        'The feature doesn\'t break the site when data is missing',
        'Error states are handled gracefully',
        'No console errors in browser'
    ],
    responsive: [
        'Works on android devices',
        'Works on ios devices',
        'Works on tablet devices',
        'Works on desktop browsers',
        'No layout breaks on different screen sizes'
    ]
};

// Project-specific preset checklist items
const PROJECT_SPECIFIC_ITEMS = {
    'wts': {
        uiux: [
            'WTS branding guidelines followed',
            'WTS color scheme applied consistently'
        ],
        functionality: [
            'Search stage working',
        ],
        responsive: []
    },
    'hoerzu/tvdigital': {
        uiux: [
            'Program listings readable',
        ],
        functionality: [
            'TV schedule data loading correctly',
            'Program search working',
            'Recording reminders functional',
            'Ads are working'
        ],
        responsive: [
            'TV guide grid responsive on all devices'
        ]
    },
    'schoenklinik': {
        uiux: [
            'Design according to styleguide'
        ],
        functionality: [
            'Patient portal functionality verified'
        ],
        responsive: [
        ]
    },
    'caritas': {
        uiux: [
        ],
        functionality: [
            'Donation processing working',
            'Multi-language support verified'
        ],
        responsive: [
        ]
    },
    'metrohm': {
        uiux: [
            'Industrial/technical design aesthetic',
            'Technical documentation accessible',
            'Product catalog well-organized'
        ],
        functionality: [
            'Product configurator working',
            'Technical specs display correctly',
            'B2B ordering system functional'
        ],
        responsive: [
            'Works in industrial tablet environments'
        ]
    },
    'kontron': {
        uiux: [
            'Enterprise technology design standards',
            'Technical product presentation clear',
            'B2B interface professional'
        ],
        functionality: [
            'Product comparison tools working',
            'Technical documentation downloads functional',
            'Partner portal access verified'
        ],
        responsive: [
            'Optimized for business environments'
        ]
    }
};

