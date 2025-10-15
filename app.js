// ========================================
// DATA STRUCTURE & CONSTANTS
// ========================================

// Predefined checklist items for each category
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

// Global state
let projects = {};
let currentProjectId = null;

// ========================================
// INITIALIZATION
// ========================================

/**
 * Initialize the application on page load
 */
function init() {
    loadProjects();
    setupEventListeners();
    updateProjectSelector();
    updateUI();
}

/**
 * Set up all event listeners
 */
function setupEventListeners() {
    // New project button
    document.getElementById('newProjectBtn').addEventListener('click', openNewProjectModal);
    
    // Modal buttons
    document.getElementById('cancelProjectBtn').addEventListener('click', closeNewProjectModal);
    document.getElementById('createProjectBtn').addEventListener('click', createProject);
    
    // Project selector
    document.getElementById('projectSelect').addEventListener('change', (e) => {
        currentProjectId = e.target.value || null;
        updateDeleteButtonState();
        updateUI();
    });
    
    // Delete project button
    document.getElementById('deleteProjectBtn').addEventListener('click', deleteProject);
    
    // Enter key in project name input
    document.getElementById('projectNameInput').addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            createProject();
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
 * Load projects from localStorage
 */
function loadProjects() {
    const stored = localStorage.getItem('devChecklistProjects');
    if (stored) {
        try {
            projects = JSON.parse(stored);
        } catch (e) {
            console.error('Error loading projects from localStorage:', e);
            projects = {};
        }
    }
}

/**
 * Save projects to localStorage
 */
function saveProjects() {
    try {
        localStorage.setItem('devChecklistProjects', JSON.stringify(projects));
    } catch (e) {
        console.error('Error saving projects to localStorage:', e);
        alert('Error saving data. Your changes may not persist.');
    }
}

// ========================================
// PROJECT MANAGEMENT
// ========================================

/**
 * Open the new project modal
 */
function openNewProjectModal() {
    document.getElementById('newProjectModal').classList.remove('hidden');
    document.getElementById('projectNameInput').value = '';
    document.getElementById('projectNameInput').focus();
}

/**
 * Close the new project modal
 */
function closeNewProjectModal() {
    document.getElementById('newProjectModal').classList.add('hidden');
}

/**
 * Create a new project
 */
function createProject() {
    const nameInput = document.getElementById('projectNameInput');
    const name = nameInput.value.trim();
    
    if (!name) {
        alert('Please enter a project name');
        return;
    }

    // Generate unique ID
    const id = 'project_' + Date.now();
    
    // Create project with predefined items
    projects[id] = {
        id: id,
        name: name,
        created: new Date().toISOString(),
        categories: {
            uiux: createCategoryItems(PREDEFINED_ITEMS.uiux),
            functionality: createCategoryItems(PREDEFINED_ITEMS.functionality),
            responsive: createCategoryItems(PREDEFINED_ITEMS.responsive)
        }
    };

    saveProjects();
    currentProjectId = id;
    updateProjectSelector();
    updateUI();
    closeNewProjectModal();
}

/**
 * Create category items from an array of labels
 */
function createCategoryItems(labels) {
    return labels.map((label, index) => ({
        id: 'item_' + Date.now() + '_' + index,
        label: label,
        checked: false,
        isPredefined: true
    }));
}

/**
 * Delete the current project
 */
function deleteProject() {
    if (!currentProjectId) return;
    
    const projectName = projects[currentProjectId].name;
    if (confirm(`Are you sure you want to delete "${projectName}"? This action cannot be undone.`)) {
        delete projects[currentProjectId];
        saveProjects();
        currentProjectId = null;
        updateProjectSelector();
        updateUI();
    }
}

/**
 * Update the delete button's disabled state
 */
function updateDeleteButtonState() {
    const deleteBtn = document.getElementById('deleteProjectBtn');
    
    if (currentProjectId) {
        deleteBtn.disabled = false;
        deleteBtn.removeAttribute('disabled');
    } else {
        deleteBtn.disabled = true;
        deleteBtn.setAttribute('disabled', 'disabled');
    }
}

/**
 * Update the project selector dropdown
 */
function updateProjectSelector() {
    const select = document.getElementById('projectSelect');
    
    // Clear existing options except the first one
    select.innerHTML = '<option value="">Select a project...</option>';
    
    // Add project options
    Object.values(projects).forEach(project => {
        const option = document.createElement('option');
        option.value = project.id;
        option.textContent = project.name;
        if (project.id === currentProjectId) {
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
    if (!currentProjectId) return;
    
    const item = projects[currentProjectId].categories[category].find(i => i.id === itemId);
    if (item) {
        item.checked = !item.checked;
        saveProjects();
        updateUI();
    }
}

/**
 * Add a custom item to a category
 */
function addCustomItem(category) {
    if (!currentProjectId) return;
    
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

    projects[currentProjectId].categories[category].push(newItem);
    saveProjects();
    input.value = '';
    updateUI();
}

/**
 * Delete a custom item from a category
 */
function deleteCustomItem(category, itemId) {
    if (!currentProjectId) return;
    
    const categoryItems = projects[currentProjectId].categories[category];
    const itemIndex = categoryItems.findIndex(i => i.id === itemId);
    
    if (itemIndex !== -1 && !categoryItems[itemIndex].isPredefined) {
        categoryItems.splice(itemIndex, 1);
        saveProjects();
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
    if (currentProjectId && projects[currentProjectId]) {
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
 * Render all checklist items for the current project
 */
function renderChecklist() {
    if (!currentProjectId) return;
    
    const project = projects[currentProjectId];
    
    // Render each category
    renderCategory('uiux', project.categories.uiux);
    renderCategory('functionality', project.categories.functionality);
    renderCategory('responsive', project.categories.responsive);
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
    if (!currentProjectId) return;
    
    const project = projects[currentProjectId];
    
    // Update each category's progress
    updateCategoryProgress('uiux', project.categories.uiux);
    updateCategoryProgress('functionality', project.categories.functionality);
    updateCategoryProgress('responsive', project.categories.responsive);
    
    // Update overall progress
    updateOverallProgress(project);
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
 * Update overall project progress
 */
function updateOverallProgress(project) {
    const allItems = [
        ...project.categories.uiux,
        ...project.categories.functionality,
        ...project.categories.responsive
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

