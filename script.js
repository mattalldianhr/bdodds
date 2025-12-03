// Initialize the app
document.addEventListener('DOMContentLoaded', () => {
    initializeTabs();
    initializeGrids();
    initializeSumButtons();
    initializeBarEntry();
    initializeHitProbability();
    initializeBearoff();
    // Initialize tables with default values
    updateSumsTable(2);
    updateBarTable(1);
    updateHitTable(1);
    updateBearoffTable(1, 0);
});

// Tab functionality
function initializeTabs() {
    const tabButtons = document.querySelectorAll('.tab-button');
    const tabContents = document.querySelectorAll('.tab-content');
    
    tabButtons.forEach(button => {
        button.addEventListener('click', () => {
            const targetTab = button.dataset.tab;
            
            // Remove active class from all buttons and contents
            tabButtons.forEach(btn => btn.classList.remove('active'));
            tabContents.forEach(content => content.classList.remove('active'));
            
            // Add active class to clicked button and corresponding content
            button.classList.add('active');
            document.getElementById(`${targetTab}-tab`).classList.add('active');
            
            // Initialize table for this tab
            initializeTableForTab(targetTab);
        });
    });
}

function initializeTableForTab(tab) {
    switch(tab) {
        case 'sums':
            const activeSum = document.querySelector('.sum-button.active');
            if (activeSum) {
                updateSumsTable(parseInt(activeSum.dataset.sum));
            } else {
                updateSumsTable(2);
            }
            break;
        case 'bar':
            const activeBar = document.querySelector('#bar-tab .option-button.active');
            if (activeBar) {
                updateBarTable(parseInt(activeBar.dataset.value));
            } else {
                updateBarTable(1);
            }
            break;
        case 'hit':
            const activeHit = document.querySelector('#hit-tab .option-button.active');
            if (activeHit) {
                updateHitTable(parseInt(activeHit.dataset.value));
            } else {
                updateHitTable(1);
            }
            break;
        case 'bearoff':
            const activeMan1 = document.querySelector('#bearoff-tab .bearoff-input-group:first-child .option-button.active');
            const activeMan2 = document.querySelector('#bearoff-tab .bearoff-input-group:last-child .option-button.active');
            const man1 = activeMan1 ? parseInt(activeMan1.dataset.value) : 1;
            const man2 = activeMan2 ? parseInt(activeMan2.dataset.value) : 0;
            updateBearoffTable(man1, man2);
            break;
    }
}

// Create grids for all tabs
function initializeGrids() {
    createGrid('diceGrid');
    createGrid('barGrid');
    createGrid('hitGrid');
    createGrid('bearoffGrid');
}

function createGrid(gridId) {
    const grid = document.getElementById(gridId);
    if (!grid) return;
    
    // Clear existing content
    grid.innerHTML = '';
    
    // Top-left corner (empty)
    grid.appendChild(createGridLabel(''));
    
    // Column headers (Die 2)
    for (let i = 1; i <= 6; i++) {
        grid.appendChild(createGridLabel(i));
    }
    
    // Row headers and cells
    for (let row = 1; row <= 6; row++) {
        // Row header (Die 1)
        grid.appendChild(createGridLabel(row));
        
        // Cells
        for (let col = 1; col <= 6; col++) {
            const cell = createGridCell(row, col);
            grid.appendChild(cell);
        }
    }
}

function createGridLabel(text) {
    const label = document.createElement('div');
    label.className = 'grid-label';
    label.textContent = text;
    return label;
}

function createGridCell(die1, die2) {
    const cell = document.createElement('div');
    cell.className = 'grid-cell';
    
    const sum = die1 + die2;
    const isDouble = die1 === die2;
    
    if (isDouble) {
        cell.classList.add('double');
        cell.textContent = `${die1}-${die2}`;
    } else {
        cell.textContent = `${die1}-${die2}`;
    }
    
    cell.dataset.die1 = die1;
    cell.dataset.die2 = die2;
    cell.dataset.sum = sum;
    
    return cell;
}

function clearGridHighlights(gridId) {
    const grid = document.getElementById(gridId);
    if (!grid) return;
    grid.querySelectorAll('.grid-cell').forEach(cell => {
        cell.classList.remove('highlighted', 'related');
    });
}

function highlightGridCells(gridId, predicate) {
    const grid = document.getElementById(gridId);
    if (!grid) return;
    
    grid.querySelectorAll('.grid-cell').forEach(cell => {
        const die1 = parseInt(cell.dataset.die1);
        const die2 = parseInt(cell.dataset.die2);
        
        if (predicate(die1, die2)) {
            cell.classList.add('highlighted');
        }
    });
}

// Initialize sum buttons (2-12)
function initializeSumButtons() {
    const container = document.getElementById('sumButtons');
    
    for (let sum = 2; sum <= 12; sum++) {
        const button = document.createElement('button');
        button.className = 'sum-button';
        button.textContent = sum;
        button.dataset.sum = sum;
        
        button.addEventListener('click', () => {
            selectSum(sum);
        });
        
        container.appendChild(button);
    }
}

function selectSum(sum) {
    // Update button states
    document.querySelectorAll('.sum-button').forEach(btn => {
        btn.classList.remove('active');
        if (parseInt(btn.dataset.sum) === sum) {
            btn.classList.add('active');
        }
    });
    
    // Clear and highlight grid
    clearGridHighlights('diceGrid');
    highlightGridCells('diceGrid', (die1, die2) => die1 + die2 === sum);
    
    // Count ways
    let count = 0;
    for (let die1 = 1; die1 <= 6; die1++) {
        for (let die2 = 1; die2 <= 6; die2++) {
            if (die1 + die2 === sum) count++;
        }
    }
    
    // Update probability info
    const probability = ((count / 36) * 100).toFixed(1);
    const info = document.getElementById('probabilityInfo');
    info.textContent = `${sum} can be rolled ${count} way${count !== 1 ? 's' : ''} = ${probability}%`;
    
    // Update table
    updateSumsTable(sum);
}

function updateSumsTable(sum) {
    const tbody = document.getElementById('sumsTableBody');
    tbody.innerHTML = '';
    
    // Create summary by sum
    const sumGroups = {};
    for (let die1 = 1; die1 <= 6; die1++) {
        for (let die2 = 1; die2 <= 6; die2++) {
            const sumValue = die1 + die2;
            if (!sumGroups[sumValue]) {
                sumGroups[sumValue] = [];
            }
            sumGroups[sumValue].push([die1, die2]);
        }
    }
    
    // Display all sums with probabilities
    for (let s = 2; s <= 12; s++) {
        const row = document.createElement('tr');
        const combinations = sumGroups[s];
        const count = combinations.length;
        const probability = ((count / 36) * 100).toFixed(1);
        const isHighlighted = s === sum;
        
        if (isHighlighted) {
            row.classList.add('highlighted-row');
        }
        
        row.innerHTML = `
            <td>${s}</td>
            <td>${count}</td>
            <td>${probability}%</td>
        `;
        
        tbody.appendChild(row);
    }
}

// Bar Entry Probability (Table 2)
const barEntryData = {
    1: { ways: 11, chance: 31, odds: "25 to 11 against" },
    2: { ways: 20, chance: 56, odds: "5 to 4 in favor" },
    3: { ways: 27, chance: 75, odds: "3 to 1 in favor" },
    4: { ways: 32, chance: 89, odds: "8 to 1 in favor" },
    5: { ways: 35, chance: 97, odds: "35 to 1 in favor" }
};

// Track which points are blocked
let blockedPoints = new Set();

function initializeBarEntry() {
    const buttons = document.querySelectorAll('#bar-tab .point-toggle');
    buttons.forEach(button => {
        button.addEventListener('click', () => {
            const point = parseInt(button.dataset.point);
            
            // Toggle blocked state
            if (blockedPoints.has(point)) {
                blockedPoints.delete(point);
                button.classList.remove('blocked');
            } else {
                blockedPoints.add(point);
                button.classList.add('blocked');
            }
            
            // Update display
            updateBarEntry();
        });
    });
    
    // Initialize with no blocked points
    updateBarEntry();
}

function updateBarEntry() {
    const openPoints = [];
    for (let i = 1; i <= 6; i++) {
        if (!blockedPoints.has(i)) {
            openPoints.push(i);
        }
    }
    
    // Count ways to enter
    let waysToEnter = 0;
    for (let die1 = 1; die1 <= 6; die1++) {
        for (let die2 = 1; die2 <= 6; die2++) {
            // Can enter if either die matches an open point
            if (openPoints.includes(die1) || openPoints.includes(die2)) {
                waysToEnter++;
            }
        }
    }
    
    const chance = Math.round((waysToEnter / 36) * 100);
    const blockedCount = blockedPoints.size;
    const openCount = 6 - blockedCount;
    
    let odds;
    if (waysToEnter === 36) {
        odds = "Always enters";
    } else if (waysToEnter === 0) {
        odds = "Cannot enter";
    } else if (waysToEnter > 18) {
        const ratio = Math.round((waysToEnter / (36 - waysToEnter)) * 10) / 10;
        odds = `${ratio} to 1 in favor`;
    } else {
        const ratio = Math.round(((36 - waysToEnter) / waysToEnter) * 10) / 10;
        odds = `${ratio} to 1 against`;
    }
    
    const result = document.getElementById('barEntryResult');
    const blockedStr = blockedPoints.size > 0 ? Array.from(blockedPoints).sort((a,b) => a-b).join(', ') : 'none';
    const openStr = openPoints.length > 0 ? openPoints.join(', ') : 'none';
    
    result.innerHTML = `
        <div class="probability-display">${chance}% chance of entering</div>
        <div class="probability-details">Blocked: ${blockedStr}</div>
        <div class="probability-details">Open: ${openStr}</div>
        <div class="probability-details">${waysToEnter} ways to come in out of 36</div>
        <div class="probability-details">Odds: ${odds}</div>
    `;
    
    // Highlight grid
    clearGridHighlights('barGrid');
    highlightBarEntryGrid(openPoints);
    
    // Update table
    updateBarTable();
}

function updateBarTable() {
    const tbody = document.getElementById('barTableBody');
    tbody.innerHTML = '';
    
    // Show all options (0-5 blocked points)
    for (let blocked = 0; blocked <= 5; blocked++) {
        const open = 6 - blocked;
        
        let data;
        if (open >= 6) {
            data = { ways: 36, chance: 100, odds: "Always enters" };
        } else if (open === 0) {
            data = { ways: 0, chance: 0, odds: "Cannot enter" };
        } else {
            data = barEntryData[open];
        }
        
        const row = document.createElement('tr');
        const isHighlighted = blocked === blockedPoints.size;
        
        if (isHighlighted) {
            row.classList.add('highlighted-row');
        }
        
        row.innerHTML = `
            <td>${blocked}</td>
            <td>${open}</td>
            <td>${data.ways}</td>
            <td>${data.chance}%</td>
            <td>${data.odds}</td>
        `;
        
        tbody.appendChild(row);
    }
}

function highlightBarEntryGrid(openPoints) {
    const grid = document.getElementById('barGrid');
    if (!grid) return;
    
    grid.querySelectorAll('.grid-cell').forEach(cell => {
        const die1 = parseInt(cell.dataset.die1);
        const die2 = parseInt(cell.dataset.die2);
        
        // Can enter if either die matches an open point
        if (openPoints.includes(die1) || openPoints.includes(die2)) {
            cell.classList.add('highlighted');
        }
    });
}

// Hit Probability (Table 3)
const hitProbabilityData = {
    1: { ways: 11, chance: 31, odds: "25 to 11" },
    2: { ways: 12, chance: 33, odds: "2 to 1" },
    3: { ways: 14, chance: 39, odds: "11 to 7" },
    4: { ways: 15, chance: 42, odds: "7 to 5" },
    5: { ways: 15, chance: 42, odds: "7 to 5" },
    6: { ways: 17, chance: 47, odds: "19 to 17" },
    7: { ways: 6, chance: 17, odds: "5 to 1" },
    8: { ways: 6, chance: 17, odds: "5 to 1" },
    9: { ways: 5, chance: 14, odds: "31 to 5" },
    10: { ways: 3, chance: 8, odds: "11 to 1" },
    11: { ways: 2, chance: 6, odds: "17 to 1" },
    12: { ways: 3, chance: 8, odds: "11 to 1" }
};

function initializeHitProbability() {
    const buttons = document.querySelectorAll('#hit-tab .option-button');
    buttons.forEach(button => {
        button.addEventListener('click', () => {
            // Remove active from all buttons in this group
            buttons.forEach(btn => btn.classList.remove('active'));
            // Add active to clicked button
            button.classList.add('active');
            // Update display
            updateHitProbability(parseInt(button.dataset.value));
        });
    });
    // Set initial selection
    buttons[0].classList.add('active');
    updateHitProbability(1);
}

function updateHitProbability(distance) {
    const data = hitProbabilityData[distance];
    const result = document.getElementById('hitResult');
    
    result.innerHTML = `
        <div class="probability-display">${data.chance}% chance of being hit</div>
        <div class="probability-details">${data.ways} ways to be hit out of 36</div>
        <div class="probability-details">Odds against being hit: ${data.odds}</div>
    `;
    
    // Highlight grid - show combinations that can hit at this distance
    clearGridHighlights('hitGrid');
    highlightHitGrid(distance);
    
    // Update table
    updateHitTable(distance);
}

function updateHitTable(distance) {
    const tbody = document.getElementById('hitTableBody');
    tbody.innerHTML = '';
    
    // Show all distances (1-12)
    for (let dist = 1; dist <= 12; dist++) {
        const data = hitProbabilityData[dist];
        
        const row = document.createElement('tr');
        const isHighlighted = dist === distance;
        
        if (isHighlighted) {
            row.classList.add('highlighted-row');
        }
        
        row.innerHTML = `
            <td>${dist}</td>
            <td>${data.ways}</td>
            <td>${data.chance}%</td>
            <td>${data.odds}</td>
        `;
        
        tbody.appendChild(row);
    }
}

function highlightHitGrid(distance) {
    const grid = document.getElementById('hitGrid');
    if (!grid) return;
    
    // Get the actual hit combinations for this distance
    const hitCombos = getHitCombinations(distance);
    
    grid.querySelectorAll('.grid-cell').forEach(cell => {
        const die1 = parseInt(cell.dataset.die1);
        const die2 = parseInt(cell.dataset.die2);
        
        // Check if this combination can hit
        const canHit = hitCombos.some(([d1, d2]) => 
            (die1 === d1 && die2 === d2) || (die1 === d2 && die2 === d1)
        );
        
        if (canHit) {
            cell.classList.add('highlighted');
        }
    });
}

function getHitCombinations(distance) {
    const combos = [];
    
    // Based on Table 3 from the article
    // For each distance, list all combinations that can hit
    for (let die1 = 1; die1 <= 6; die1++) {
        for (let die2 = 1; die2 <= 6; die2++) {
            let canHit = false;
            
            if (distance <= 6) {
                // Can hit with that number directly (single die) or with sum
                canHit = die1 === distance || die2 === distance || die1 + die2 === distance;
            } else {
                // For distances > 6, specific combinations
                // Distance 7: need 7 (6-1, 5-2, 4-3)
                // Distance 8: need 8 (6-2, 5-3, 4-4)  
                // Distance 9: need 9 (6-3, 5-4)
                // Distance 10: need 10 (6-4, 5-5)
                // Distance 11: need 11 (6-5)
                // Distance 12: need 12 (6-6)
                canHit = die1 + die2 === distance;
            }
            
            if (canHit) {
                combos.push([die1, die2]);
            }
        }
    }
    
    return combos;
}

// Bear-off Probability (Table 4)
const bearoffTable = {
    "12": { "6-6": { oneRoll: { ways: 4, percent: 11 }, twoRolls: 78 } },
    "11": { "6-5": { oneRoll: { ways: 6, percent: 17 }, twoRolls: 88 } },
    "10": { 
        "5-5": { oneRoll: { ways: 6, percent: 17 }, twoRolls: 92 },
        "6-4": { oneRoll: { ways: 8, percent: 22 }, twoRolls: 93 }
    },
    "9": {
        "5-4": { oneRoll: { ways: 10, percent: 28 }, twoRolls: 96 },
        "6-3": { oneRoll: { ways: 10, percent: 28 }, twoRolls: 97 }
    },
    "8": {
        "4-4": { oneRoll: { ways: 11, percent: 31 }, twoRolls: 98 },
        "6-2": { oneRoll: { ways: 13, percent: 36 }, twoRolls: 99 },
        "5-3": { oneRoll: { ways: 14, percent: 39 }, twoRolls: 99 }
    },
    "7": {
        "6-1": { oneRoll: { ways: 15, percent: 42 }, twoRolls: 99 },
        "4-3": { oneRoll: { ways: 17, percent: 47 }, twoRolls: 99 },
        "5-2": { oneRoll: { ways: 19, percent: 53 }, twoRolls: 99 }
    },
    "6": {
        "3-3": { oneRoll: { ways: 17, percent: 47 }, twoRolls: 100 },
        "5-1": { oneRoll: { ways: 23, percent: 64 }, twoRolls: 100 },
        "4-2": { oneRoll: { ways: 23, percent: 64 }, twoRolls: 100 },
        "6": { oneRoll: { ways: 27, percent: 75 }, twoRolls: 100 }
    },
    "5": {
        "3-2": { oneRoll: { ways: 25, percent: 69 }, twoRolls: 100 },
        "4-1": { oneRoll: { ways: 29, percent: 81 }, twoRolls: 100 },
        "5": { oneRoll: { ways: 31, percent: 86 }, twoRolls: 100 }
    },
    "4": {
        "2-2": { oneRoll: { ways: 26, percent: 72 }, twoRolls: 100 },
        "3-1": { oneRoll: { ways: 34, percent: 94 }, twoRolls: 100 },
        "4": { oneRoll: { ways: 34, percent: 94 }, twoRolls: 100 }
    },
    "3": {
        "2-1": { oneRoll: { ways: 36, percent: 100 }, twoRolls: 100 },
        "3": { oneRoll: { ways: 36, percent: 100 }, twoRolls: 100 }
    },
    "2": {
        "1-1": { oneRoll: { ways: 36, percent: 100 }, twoRolls: 100 },
        "2": { oneRoll: { ways: 36, percent: 100 }, twoRolls: 100 }
    }
};

function initializeBearoff() {
    // Get button groups
    const man1Buttons = document.querySelectorAll('#bearoff-tab .bearoff-input-group:first-child .option-button');
    const man2Buttons = document.querySelectorAll('#bearoff-tab .bearoff-input-group:last-child .option-button');
    
    let man1Value = 1;
    let man2Value = 0;
    
    // Set up man1 buttons
    man1Buttons.forEach(button => {
        button.addEventListener('click', () => {
            man1Buttons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');
            man1Value = parseInt(button.dataset.value);
            updateBearoff(man1Value, man2Value);
        });
    });
    
    // Set up man2 buttons
    man2Buttons.forEach(button => {
        button.addEventListener('click', () => {
            man2Buttons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');
            man2Value = parseInt(button.dataset.value);
            updateBearoff(man1Value, man2Value);
        });
    });
    
    // Set initial selections
    man1Buttons[0].classList.add('active');
    man2Buttons[0].classList.add('active');
    updateBearoff(1, 0);
}

function updateBearoff(man1, man2) {
    const result = document.getElementById('bearoffResult');
    
    if (man2 === 0) {
        // One man - look up in table
        const total = man1.toString();
        const key = man1.toString();
        const tableEntry = bearoffTable[total];
        
        if (tableEntry && tableEntry[key]) {
            const data = tableEntry[key];
            result.innerHTML = `
                <div class="probability-display">One man on point ${man1}</div>
                <div class="probability-details">In one roll: ${data.oneRoll.percent}% (${data.oneRoll.ways} ways)</div>
                <div class="probability-details">In two rolls: ${data.twoRolls}%</div>
            `;
            highlightBearoffGrid(man1, 0, data.oneRoll.ways);
            updateBearoffTable(man1, 0);
        } else {
            const ways = calculateBearoffWaysOneMan(man1);
            const percent = Math.round((ways / 36) * 100);
            const twoRolls = calculateTwoRollProbability(ways);
            
            result.innerHTML = `
                <div class="probability-display">One man on point ${man1}</div>
                <div class="probability-details">In one roll: ${percent}% (${ways} ways)</div>
                <div class="probability-details">In two rolls: ${twoRolls}%</div>
            `;
            highlightBearoffGrid(man1, 0, ways);
            updateBearoffTable(man1, 0);
        }
    } else {
        // Two men - look up in table
        const total = (man1 + man2).toString();
        const key1 = `${Math.min(man1, man2)}-${Math.max(man1, man2)}`;
        const key2 = `${man1}-${man2}`;
        const tableEntry = bearoffTable[total];
        
        let data = null;
        if (tableEntry) {
            data = tableEntry[key1] || tableEntry[key2];
        }
        
        if (data) {
            result.innerHTML = `
                <div class="probability-display">Two men on points ${man1} and ${man2}</div>
                <div class="probability-details">Total: ${man1 + man2} points</div>
                <div class="probability-details">In one roll: ${data.oneRoll.percent}% (${data.oneRoll.ways} ways)</div>
                <div class="probability-details">In two rolls: ${data.twoRolls}%</div>
            `;
            highlightBearoffGrid(man1, man2, data.oneRoll.ways);
            updateBearoffTable(man1, man2);
        } else {
            const ways = calculateBearoffWaysTwoMen(man1, man2);
            const percent = Math.round((ways / 36) * 100);
            const twoRolls = calculateTwoRollProbability(ways);
            
            result.innerHTML = `
                <div class="probability-display">Two men on points ${man1} and ${man2}</div>
                <div class="probability-details">Total: ${man1 + man2} points</div>
                <div class="probability-details">In one roll: ${percent}% (${ways} ways)</div>
                <div class="probability-details">In two rolls: ${twoRolls}%</div>
            `;
            highlightBearoffGrid(man1, man2, ways);
            updateBearoffTable(man1, man2);
        }
    }
}

function updateBearoffTable(man1, man2) {
    const tbody = document.getElementById('bearoffTableBody');
    tbody.innerHTML = '';
    
    // Show all possible positions
    // First, show single man positions (1-6)
    for (let point = 1; point <= 6; point++) {
        const ways = calculateBearoffWaysOneMan(point);
        const percent = Math.round((ways / 36) * 100);
        const twoRolls = calculateTwoRollProbability(ways);
        
        const row = document.createElement('tr');
        const isHighlighted = man2 === 0 && point === man1;
        
        if (isHighlighted) {
            row.classList.add('highlighted-row');
        }
        
        row.innerHTML = `
            <td>${point} (single)</td>
            <td>${ways}</td>
            <td>${percent}%</td>
            <td>${twoRolls}%</td>
        `;
        
        tbody.appendChild(row);
    }
    
    // Then show two-man positions (combinations)
    const twoManPositions = [];
    for (let p1 = 1; p1 <= 6; p1++) {
        for (let p2 = 1; p2 <= 6; p2++) {
            if (p1 <= p2) { // Avoid duplicates
                twoManPositions.push([p1, p2]);
            }
        }
    }
    
    // Sort by total points
    twoManPositions.sort((a, b) => (a[0] + a[1]) - (b[0] + b[1]));
    
    // Limit to most common/relevant positions (total <= 8 for practical purposes)
    const relevantPositions = twoManPositions.filter(([p1, p2]) => p1 + p2 <= 8);
    
    for (const [p1, p2] of relevantPositions) {
        const ways = calculateBearoffWaysTwoMen(p1, p2);
        const percent = Math.round((ways / 36) * 100);
        const twoRolls = calculateTwoRollProbability(ways);
        
        const row = document.createElement('tr');
        const isHighlighted = man2 !== 0 && ((p1 === man1 && p2 === man2) || (p1 === man2 && p2 === man1));
        
        if (isHighlighted) {
            row.classList.add('highlighted-row');
        }
        
        row.innerHTML = `
            <td>${p1}-${p2}</td>
            <td>${ways}</td>
            <td>${percent}%</td>
            <td>${twoRolls}%</td>
        `;
        
        tbody.appendChild(row);
    }
}

function highlightBearoffGrid(man1, man2, targetWays) {
    clearGridHighlights('bearoffGrid');
    const grid = document.getElementById('bearoffGrid');
    if (!grid) return;
    
    let highlighted = 0;
    grid.querySelectorAll('.grid-cell').forEach(cell => {
        const die1 = parseInt(cell.dataset.die1);
        const die2 = parseInt(cell.dataset.die2);
        
        let canBearOff = false;
        
        if (man2 === 0) {
            // One man - can bear off if at least one die >= point
            canBearOff = die1 >= man1 || die2 >= man1;
        } else {
            // Two men - need to bear off both
            canBearOff = canBearOffTwoMen(die1, die2, man1, man2);
        }
        
        if (canBearOff) {
            cell.classList.add('highlighted');
            highlighted++;
        }
    });
}

function canBearOffTwoMen(die1, die2, point1, point2) {
    // Check all possible assignments of dice to men
    if (point1 === point2) {
        // Both on same point
        return (die1 >= point1 && die2 >= point1) || die1 >= point1 * 2 || die2 >= point1 * 2;
    } else {
        // Different points
        return (die1 >= point1 && die2 >= point2) ||
               (die1 >= point2 && die2 >= point1) ||
               (die1 >= Math.max(point1, point2) && die2 >= Math.min(point1, point2)) ||
               (die1 >= point1 && die1 >= point2) ||
               (die2 >= point1 && die2 >= point2);
    }
}

function calculateBearoffWaysOneMan(point) {
    let ways = 0;
    for (let die1 = 1; die1 <= 6; die1++) {
        for (let die2 = 1; die2 <= 6; die2++) {
            if (die1 >= point || die2 >= point) {
                ways++;
            }
        }
    }
    return ways;
}

function calculateBearoffWaysTwoMen(point1, point2) {
    let ways = 0;
    for (let die1 = 1; die1 <= 6; die1++) {
        for (let die2 = 1; die2 <= 6; die2++) {
            if (canBearOffTwoMen(die1, die2, point1, point2)) {
                ways++;
            }
        }
    }
    return ways;
}

function calculateTwoRollProbability(oneRollWays) {
    const missProbability = (36 - oneRollWays) / 36;
    const twoRollMiss = missProbability * missProbability;
    const twoRollSuccess = (1 - twoRollMiss) * 100;
    return Math.round(twoRollSuccess);
}
