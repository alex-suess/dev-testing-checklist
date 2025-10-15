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
        'Consistent styling across all pages',
        'Proper spacing and alignment',
        'Readable fonts and text sizes',
        'Sufficient color contrast for accessibility',
        'Loading states for async operations',
        'Hover states for interactive elements',
        'Visual feedback for user actions',
        'Proper use of whitespace',
        'Consistent button styles',
        'Images have alt text',
        'Icons are intuitive and consistent',
        'Error messages are clear and helpful'
    ],
    functionality: [
        'All forms validate input correctly',
        'All buttons perform expected actions',
        'Links navigate to correct destinations',
        'Error handling works properly',
        'Success messages display correctly',
        'Data saves and loads correctly',
        'Search functionality works as expected',
        'Filters and sorting work properly',
        'Authentication/authorization works',
        'API calls handle errors gracefully',
        'No console errors in browser',
        'All CRUD operations work correctly'
    ],
    responsive: [
        'Mobile view (320px - 480px)',
        'Tablet view (768px - 1024px)',
        'Desktop view (1280px+)',
        'Test in Chrome',
        'Test in Firefox',
        'Test in Safari',
        'Test in Edge',
        'Touch interactions work on mobile',
        'Navigation menu works on all screen sizes',
        'Images scale properly',
        'Text is readable on all devices',
        'No horizontal scrolling on mobile'
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
            'WTS API integration working',
            'WTS data synchronization verified'
        ],
        responsive: [
            'WTS mobile app compatibility checked'
        ]
    },
    'hoerzu/tvdigital': {
        uiux: [
            'TV guide layout optimized',
            'Program listings readable',
            'Magazine-style design elements present'
        ],
        functionality: [
            'TV schedule data loading correctly',
            'Program search working',
            'Recording reminders functional'
        ],
        responsive: [
            'TV guide grid responsive on all devices'
        ]
    },
    'schoenklinik': {
        uiux: [
            'Medical/healthcare design standards met',
            'Accessibility for patients verified',
            'Professional healthcare appearance'
        ],
        functionality: [
            'Appointment booking system tested',
            'Patient portal functionality verified',
            'HIPAA/GDPR compliance checked'
        ],
        responsive: [
            'Works on tablets in clinical settings'
        ]
    },
    'caritas': {
        uiux: [
            'Charity/non-profit design approach',
            'Donation interface user-friendly',
            'Inclusive design principles applied'
        ],
        functionality: [
            'Donation processing working',
            'Volunteer registration tested',
            'Multi-language support verified'
        ],
        responsive: [
            'Accessible on low-end devices'
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

// Global state
let tasks = {};
let currentTaskId = null;
let currentProjectFilter = 'all'; // 'all' or a specific project id

// ========================================
// INITIALIZATION
// ========================================

/**
 * Initialize the application on page load
 */
function init() {
    loadTasks();
    setupEventListeners();
    populateProjectSelectors();
    
    // Restore selected task and project filter from sessionStorage (after reload)
    const savedTaskId = sessionStorage.getItem('selectedTaskId');
    const savedProjectFilter = sessionStorage.getItem('selectedProjectFilter');
    
    if (savedProjectFilter) {
        currentProjectFilter = savedProjectFilter;
        document.getElementById('projectFilter').value = savedProjectFilter;
        sessionStorage.removeItem('selectedProjectFilter');
    }
    
    if (savedTaskId && tasks[savedTaskId]) {
        currentTaskId = savedTaskId;
        sessionStorage.removeItem('selectedTaskId');
    }
    
    updateTaskSelector();
    updateUI();
}

/**
 * Set up all event listeners
 */
function setupEventListeners() {
    // New task button
    document.getElementById('newTaskBtn').addEventListener('click', openNewTaskModal);
    
    // Modal buttons
    document.getElementById('cancelTaskBtn').addEventListener('click', closeNewTaskModal);
    document.getElementById('createTaskBtn').addEventListener('click', createTask);
    
    // Project filter
    document.getElementById('projectFilter').addEventListener('change', (e) => {
        currentProjectFilter = e.target.value;
        currentTaskId = null; // Reset selected task when changing project
        updateTaskSelector();
        updateUI();
    });
    
    // Task selector
    document.getElementById('taskSelect').addEventListener('change', (e) => {
        currentTaskId = e.target.value || null;
        updateDeleteButtonState();
        updateUI();
    });
    
    // Delete task button
    document.getElementById('deleteTaskBtn').addEventListener('click', deleteTask);
    
    // Enter key in task name input
    document.getElementById('taskNameInput').addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            createTask();
        }
    });

    // Enter key in custom item inputs
    ['uiux', 'functionality', 'responsive'].forEach(category => {
        document.getElementById(`${category}-custom-input`).addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                addCustomItem(category);
            }
        });
    });
}

// ========================================
// LOCAL STORAGE MANAGEMENT
// ========================================

/**
 * Load tasks from localStorage
 */
function loadTasks() {
    const stored = localStorage.getItem('devChecklistTasks');
    if (stored) {
        try {
            tasks = JSON.parse(stored);
        } catch (e) {
            console.error('Error loading tasks from localStorage:', e);
            tasks = {};
        }
    }
}

/**
 * Save tasks to localStorage
 */
function saveTasks() {
    try {
        localStorage.setItem('devChecklistTasks', JSON.stringify(tasks));
    } catch (e) {
        console.error('Error saving tasks to localStorage:', e);
        alert('Error saving data. Your changes may not persist.');
    }
}

// ========================================
// PROJECT MANAGEMENT
// ========================================

/**
 * Populate project selectors (filter and modal)
 */
function populateProjectSelectors() {
    // Populate project filter
    const filterSelect = document.getElementById('projectFilter');
    filterSelect.innerHTML = '<option value="all">All Projects</option>';
    PROJECTS.forEach(project => {
        const option = document.createElement('option');
        option.value = project.id;
        option.textContent = project.name;
        filterSelect.appendChild(option);
    });
    
    // Populate project selector in modal
    const modalSelect = document.getElementById('taskProjectSelect');
    modalSelect.innerHTML = '';
    PROJECTS.forEach(project => {
        const option = document.createElement('option');
        option.value = project.id;
        option.textContent = project.name;
        modalSelect.appendChild(option);
    });
}

/**
 * Get project by ID
 */
function getProjectById(projectId) {
    return PROJECTS.find(p => p.id === projectId) || null;
}

// ========================================
// TASK MANAGEMENT
// ========================================

/**
 * Open the new task modal
 */
function openNewTaskModal() {
    document.getElementById('newTaskModal').classList.remove('hidden');
    document.getElementById('taskNameInput').value = '';
    
    // Pre-select the current project filter if not 'all'
    const projectSelect = document.getElementById('taskProjectSelect');
    if (currentProjectFilter !== 'all') {
        projectSelect.value = currentProjectFilter;
    } else {
        projectSelect.selectedIndex = 0;
    }
    
    document.getElementById('taskNameInput').focus();
}

/**
 * Close the new task modal
 */
function closeNewTaskModal() {
    document.getElementById('newTaskModal').classList.add('hidden');
}

/**
 * Create a new task
 */
function createTask() {
    const nameInput = document.getElementById('taskNameInput');
    const projectSelect = document.getElementById('taskProjectSelect');
    const name = nameInput.value.trim();
    const projectId = projectSelect.value;
    
    if (!name) {
        alert('Please enter a task name');
        return;
    }
    
    if (!projectId) {
        alert('Please select a project');
        return;
    }

    // Generate unique ID
    const id = 'task_' + Date.now();
    
    // Create task with combined predefined items (general + project-specific)
    tasks[id] = {
        id: id,
        name: name,
        projectId: projectId,
        created: new Date().toISOString(),
        categories: {
            uiux: createCategoryItems(getCombinedItems('uiux', projectId)),
            functionality: createCategoryItems(getCombinedItems('functionality', projectId)),
            responsive: createCategoryItems(getCombinedItems('responsive', projectId))
        }
    };

    saveTasks();
    
    // Store the new task ID and project filter in sessionStorage for restoration after reload
    sessionStorage.setItem('selectedTaskId', id);
    sessionStorage.setItem('selectedProjectFilter', projectId);
    
    // Reload the page to refresh the task list
    window.location.reload();
}

/**
 * Get combined items for a category (general + project-specific)
 */
function getCombinedItems(category, projectId) {
    // Start with general predefined items
    const generalItems = [...PREDEFINED_ITEMS[category]];
    
    // Add project-specific items if they exist
    const projectSpecific = PROJECT_SPECIFIC_ITEMS[projectId];
    if (projectSpecific && projectSpecific[category]) {
        return [...generalItems, ...projectSpecific[category]];
    }
    
    return generalItems;
}

/**
 * Create category items from an array of labels
 */
function createCategoryItems(labels) {
    const timestamp = Date.now();
    const randomSuffix = Math.random().toString(36).substring(2, 9);
    return labels.map((label, index) => ({
        id: `item_${timestamp}_${randomSuffix}_${index}`,
        label: label,
        checked: false,
        isPredefined: true
    }));
}

/**
 * Delete the current task
 */
function deleteTask() {
    if (!currentTaskId) return;
    
    const taskName = tasks[currentTaskId].name;
    if (confirm(`Are you sure you want to delete "${taskName}"? This action cannot be undone.`)) {
        delete tasks[currentTaskId];
        saveTasks();
        currentTaskId = null;
        updateTaskSelector();
        updateUI();
    }
}

/**
 * Update the delete button's disabled state
 */
function updateDeleteButtonState() {
    const deleteBtn = document.getElementById('deleteTaskBtn');
    
    if (currentTaskId) {
        deleteBtn.disabled = false;
        deleteBtn.removeAttribute('disabled');
    } else {
        deleteBtn.disabled = true;
        deleteBtn.setAttribute('disabled', 'disabled');
    }
}

/**
 * Update the task selector dropdown
 */
function updateTaskSelector() {
    const select = document.getElementById('taskSelect');
    
    // Clear existing options except the first one
    select.innerHTML = '<option value="">Select a task...</option>';
    
    // Filter tasks based on current project filter
    const filteredTasks = Object.values(tasks).filter(task => {
        if (currentProjectFilter === 'all') return true;
        return task.projectId === currentProjectFilter;
    });
    
    // Add task options
    filteredTasks.forEach(task => {
        const option = document.createElement('option');
        option.value = task.id;
        const project = getProjectById(task.projectId);
        const projectName = project ? project.name : 'Unknown Project';
        option.textContent = `${task.name} (${projectName})`;
        if (task.id === currentTaskId) {
            option.selected = true;
        }
        select.appendChild(option);
    });

    // Update delete button state
    updateDeleteButtonState();
}

// ========================================
// CHECKLIST ITEM MANAGEMENT
// ========================================

/**
 * Toggle a checklist item's checked state
 */
function toggleItem(category, itemId) {
    if (!currentTaskId) return;
    
    const item = tasks[currentTaskId].categories[category].find(i => i.id === itemId);
    if (item) {
        item.checked = !item.checked;
        saveTasks();
        updateUI();
    }
}

/**
 * Add a custom item to a category
 */
function addCustomItem(category) {
    if (!currentTaskId) return;
    
    const input = document.getElementById(`${category}-custom-input`);
    const label = input.value.trim();
    
    if (!label) {
        alert('Please enter an item description');
        return;
    }

    const newItem = {
        id: 'custom_' + Date.now(),
        label: label,
        checked: false,
        isPredefined: false
    };

    tasks[currentTaskId].categories[category].push(newItem);
    saveTasks();
    input.value = '';
    updateUI();
}

/**
 * Delete a custom item from a category
 */
function deleteCustomItem(category, itemId) {
    if (!currentTaskId) return;
    
    const categoryItems = tasks[currentTaskId].categories[category];
    const itemIndex = categoryItems.findIndex(i => i.id === itemId);
    
    if (itemIndex !== -1 && !categoryItems[itemIndex].isPredefined) {
        categoryItems.splice(itemIndex, 1);
        saveTasks();
        updateUI();
    }
}

// ========================================
// UI RENDERING
// ========================================

/**
 * Update the entire UI based on current state
 */
function updateUI() {
    if (currentTaskId && tasks[currentTaskId]) {
        renderChecklist();
        updateAllProgress();
        document.getElementById('checklistContainer').classList.remove('hidden');
        document.getElementById('emptyState').classList.add('hidden');
        document.getElementById('overallProgress').classList.remove('hidden');
    } else {
        document.getElementById('checklistContainer').classList.add('hidden');
        document.getElementById('emptyState').classList.remove('hidden');
        document.getElementById('overallProgress').classList.add('hidden');
    }
}

/**
 * Render all checklist items for the current task
 */
function renderChecklist() {
    if (!currentTaskId) return;
    
    const task = tasks[currentTaskId];
    
    // Render each category
    renderCategory('uiux', task.categories.uiux);
    renderCategory('functionality', task.categories.functionality);
    renderCategory('responsive', task.categories.responsive);
}

/**
 * Render items for a specific category
 */
function renderCategory(category, items) {
    const container = document.getElementById(`${category}-items`);
    container.innerHTML = '';

    items.forEach(item => {
        const itemDiv = document.createElement('div');
        itemDiv.className = 'checklist-item flex items-start gap-3 p-3 rounded-lg transition-colors duration-150';
        
        const checkboxId = `checkbox-${category}-${item.id}`;
        
        itemDiv.innerHTML = `
            <input 
                type="checkbox" 
                id="${checkboxId}"
                ${item.checked ? 'checked' : ''} 
                onchange="toggleItem('${category}', '${item.id}')"
                class="mt-1 w-4 h-4 text-slate-600 rounded focus:ring-2 focus:ring-slate-500 cursor-pointer">
            <label for="${checkboxId}" class="flex-1 text-sm ${item.checked ? 'line-through text-slate-500' : 'text-slate-300'} cursor-pointer">
                ${escapeHtml(item.label)}
            </label>
            ${!item.isPredefined ? `
                <button 
                    onclick="deleteCustomItem('${category}', '${item.id}')"
                    class="text-red-500 hover:text-red-400 transition-colors duration-150"
                    title="Delete custom item">
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
                    </svg>
                </button>
            ` : ''}
        `;
        
        container.appendChild(itemDiv);
    });
}

/**
 * Update all progress indicators
 */
function updateAllProgress() {
    if (!currentTaskId) return;
    
    const task = tasks[currentTaskId];
    
    // Update each category's progress
    updateCategoryProgress('uiux', task.categories.uiux);
    updateCategoryProgress('functionality', task.categories.functionality);
    updateCategoryProgress('responsive', task.categories.responsive);
    
    // Update overall progress
    updateOverallProgress(task);
}

/**
 * Update progress for a specific category
 */
function updateCategoryProgress(category, items) {
    const total = items.length;
    const completed = items.filter(i => i.checked).length;
    const percentage = total > 0 ? Math.round((completed / total) * 100) : 0;

    document.getElementById(`${category}-progress-text`).textContent = `${completed} / ${total} completed`;
    document.getElementById(`${category}-progress-percent`).textContent = `${percentage}%`;
    document.getElementById(`${category}-progress-bar`).style.width = `${percentage}%`;
}

/**
 * Update overall task progress
 */
function updateOverallProgress(task) {
    const allItems = [
        ...task.categories.uiux,
        ...task.categories.functionality,
        ...task.categories.responsive
    ];

    const total = allItems.length;
    const completed = allItems.filter(i => i.checked).length;
    const percentage = total > 0 ? Math.round((completed / total) * 100) : 0;

    document.getElementById('overallProgressText').textContent = `${percentage}% (${completed}/${total} items)`;
    document.getElementById('overallProgressBar').style.width = `${percentage}%`;
}

// ========================================
// UTILITY FUNCTIONS
// ========================================

/**
 * Escape HTML to prevent XSS
 */
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// ========================================
// START APPLICATION
// ========================================

// Initialize app when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
} else {
    init();
}

