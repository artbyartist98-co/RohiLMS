/**
 * =========================================================================================
 *                   ROHI SOFTWARE TECHNOLOGY PARK (STP) - LMS INTEGRATION
 * =========================================================================================
 * 
 * Google Apps Script Web App Connection Script
 * 
 * This Apps Script serves as the high-speed backend data sync server, binding
 * your React Registration and Accounting Administrative portal to any Google Sheet.
 * 
 * -----------------------------------------------------------------------------------------
 * 🚀 QUICK DEPLOYMENT INSTRUCTIONS:
 * -----------------------------------------------------------------------------------------
 * 1. Open the Google Sheet where you want to sync student application records.
 * 2. Click "Extensions" -> "Apps Script" in the top menu bar.
 * 3. Delete any default code in the editor (like myFunction) and paste this entire code block.
 * 4. Save the project (click the floppy disk icon or press Ctrl+S / Cmd+S).
 * 5. Click "Deploy" (top right corner) -> "New deployment".
 * 6. Under "Select type" (gear icon), choose "Web app".
 * 7. Configure the settings EXACTLY as follows:
 *    - Description: "Rohi STP LMS Synced Server"
 *    - Execute as: "Me" (your-email@gmail.com)
 *    - Who has access: "Anyone" (CRITICAL: Required so the React UI can post student records)
 * 8. Click "Deploy".
 * 9. Google will prompt you to "Authorize access". Grant the required permissions (choose your
 *    Google account, click "Advanced", click "Go to Untitled project (unsafe)" and then "Allow").
 * 10. Copy the generated "Web app URL" (ends in "/exec").
 * 11. Navigate to the Rohi App Admin Console -> "Developer Sync Tools" panel, paste this URL
 *     into the "Google Sheets Web App Service Endpoint URL" input, and turn on "Auto-Sync Records".
 * 
 * -----------------------------------------------------------------------------------------
 */

// Headers structure to match the student React EnrolmentRecord data objects 
const HEADERS = [
  "Registration ID",
  "Enrolment Date",
  "Course Title",
  "First Name",
  "Last Name",
  "Father's Name",
  "CNIC / ID Number",
  "Mobile Number",
  "Email Address",
  "Home Address",
  "Gender",
  "Civil Status",
  "Laptop Required",
  "Payment Plan",
  "Base Fee (PKR)",
  "Subsidy / Discount (PKR)",
  "Laptop Security (PKR)",
  "Net Payable (PKR)",
  "Installment Due Date",
  "Verification Status"
];

// Hex primary branding colors matching the STP logo profile
const THEME = {
  headerBg: "#004173",      // Deep Navy
  headerText: "#FFFFFF",    // Absolute White
  zebraLight: "#F8FAFC",    // Crisp light background
  emeraldTint: "#D1FAE5",   // Light green for Enrolled/Verified
  emeraldText: "#065F46",   // Deep green for enrolled label text
  statusPendingBg: "#FEF3C7", // Yellow warm
  statusPendingText: "#92400E" // Amber dark
};

/**
 * Handle HTTP GET Requests.
 * Used exclusively for validating active server handshakes inside the administrative panel.
 */
function doGet(e) {
  const output = {
    status: "success",
    timestamp: new Date().toISOString(),
    message: "Handshake operational! Rohi STP LMS Synchronized Endpoint is ready to receive student records.",
    sheetConfigured: getActiveSheet() !== null
  };
  
  return ContentService.createTextOutput(JSON.stringify(output))
    .setMimeType(ContentService.MimeType.JSON)
    .setHeader("Access-Control-Allow-Origin", "*");
}

/**
 * Handle HTTP POST Requests.
 * Processes single record additions ('addRecord') and full database overwrites ('bulkSync').
 */
function doPost(e) {
  try {
    // Validate request contents
    if (!e || !e.postData || !e.postData.contents) {
      return createErrorResponse("No post data payload identified in the HTTP pipeline.");
    }
    
    // Parse transmission values
    const payload = JSON.parse(e.postData.contents);
    const action = payload.action;
    
    const sheet = getOrCreateEnrolmentSheet();
    
    if (action === "addRecord") {
      const record = payload.record;
      if (!record) {
        return createErrorResponse("No record dataset passed with addRecord task.");
      }
      appendRecordRow(sheet, record);
      return createSuccessResponse("Student record appended and styled successfully.");
      
    } else if (action === "bulkSync") {
      const records = payload.records;
      if (!records || !Array.isArray(records)) {
        return createErrorResponse("No registry list records passed with bulkSync task.");
      }
      repopulateDatabaseRows(sheet, records);
      return createSuccessResponse("Sheet repopulated and formatted with " + records.length + " student records.");
      
    } else {
      return createErrorResponse("Unsupported action verb '" + action + "' parsed.");
    }
    
  } catch (err) {
    return createErrorResponse(err.toString());
  }
}

/**
 * Appends a single record dataset at the bottom of the active sheet with beautiful formatting.
 */
function appendRecordRow(sheet, record) {
  const rowData = mapRecordToRow(record);
  sheet.appendRow(rowData);
  
  // Apply visual styling to the newly appended row
  const lastRow = sheet.getLastRow();
  formatDataRow(sheet, lastRow);
  autoFitColumns(sheet);
}

/**
 * Completely clears existing records (below headers) and writes bulk student arrays for high integrity.
 */
function repopulateDatabaseRows(sheet, records) {
  // Clear all values, background colors, and alignments below the header row
  if (sheet.getLastRow() > 1) {
    const rangeToClear = sheet.getRange(2, 1, sheet.getLastRow() - 1, HEADERS.length);
    rangeToClear.clearContent();
    rangeToClear.clearFormat();
  }
  
  // Write all rows in a single batch call for lightning-fast Google gas execution limits
  if (records.length > 0) {
    const matrixValues = records.map(mapRecordToRow);
    const targetRange = sheet.getRange(2, 1, records.length, HEADERS.length);
    targetRange.setValues(matrixValues);
    
    // Apply comprehensive table grid borders & clean numbering alignments
    for (let i = 0; i < records.length; i++) {
      const rowNum = 2 + i;
      formatDataRow(sheet, rowNum);
    }
  }
  
  autoFitColumns(sheet);
}

/**
 * Maps a React JS EnrolmentRecord data model directly to flat column list arrays.
 */
function mapRecordToRow(record) {
  return [
    record.regId || "",
    record.createdAtFormatted || (record.createdAt ? new Date(record.createdAt).toLocaleString("en-US") : ""),
    record.course || "",
    record.firstName || "",
    record.lastName || "",
    record.fatherName || "",
    record.cnic || "",
    record.mobile || "",
    record.email || "",
    record.address || "",
    record.gender || "",
    record.civilStatus || "",
    record.laptop || "No",
    record.paymentPlan || "Full",
    Number(record.baseFee) || 0,
    Number(record.discount) || 0,
    Number(record.laptopFee) || 0,
    Number(record.totalFee) || 0,
    record.nextDueDate || "N/A",
    record.status || "Pending"
  ];
}

/**
 * Returns the currently active sheet structure, or retrieves the current spreadsheet instance.
 */
function getActiveSheet() {
  try {
    return SpreadsheetApp.getActiveSpreadsheet();
  } catch (err) {
    return null;
  }
}

/**
 * Safely fetches our designated "Enrolments" tab or lazy boots it instantly if missing.
 */
function getOrCreateEnrolmentSheet() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  if (!ss) {
    throw new Error("No active Spreadsheet context found. Ensure you run this code inside copy-pasted Extensions -> Apps Script.");
  }
  
  let sheet = ss.getSheetByName("Enrolments");
  if (!sheet) {
    sheet = ss.insertSheet("Enrolments");
    initializeSheetHeaders(sheet);
  } else {
    // If the sheet already exists but headers are missing or blank, initialize them
    if (sheet.getLastRow() === 0) {
      initializeSheetHeaders(sheet);
    }
  }
  return sheet;
}

/**
 * Establishes standard table headers decorated inside stylized, high-contrast branding headers.
 */
function initializeSheetHeaders(sheet) {
  sheet.appendRow(HEADERS);
  const headerRange = sheet.getRange(1, 1, 1, HEADERS.length);
  
  headerRange.setFontWeight("bold")
             .setFontSize(10)
             .setFontFamily("Inter")
             .setBackground(THEME.headerBg)
             .setFontColor(THEME.headerText)
             .setHorizontalAlignment("center")
             .setVerticalAlignment("middle");
             
  sheet.setRowHeight(1, 35);
  sheet.setFrozenRows(1);
}

/**
 * Formats a given student row cleanly: applies proper number patterns, zebra strips, and alignments.
 */
function formatDataRow(sheet, rowNum) {
  const rowRange = sheet.getRange(rowNum, 1, 1, HEADERS.length);
  
  // Set nice soft font pairing for elegant professional presentation
  rowRange.setFontFamily("Inter")
          .setFontSize(9.5)
          .setVerticalAlignment("middle");
  
  sheet.setRowHeight(rowNum, 26);
  
  // Zebra stripe rows beautifully
  if (rowNum % 2 === 0) {
    rowRange.setBackground(THEME.zebraLight);
  } else {
    rowRange.setBackground("#FFFFFF");
  }
  
  // Format numeric columns (Base Fee, Discount, Laptop Fee, Net Price)
  // Column 15: Base Fee, Column 16: Discount, Column 17: Laptop Fee, Column 18: Net Payable
  const financialRange = sheet.getRange(rowNum, 15, 1, 4);
  financialRange.setNumberFormat("#,##0\" PKR\"")
                .setHorizontalAlignment("right")
                .setFontFamily("Courier New")
                .setFontWeight("bold");
                
  // Align unique code strings to center
  const centerCols = [1, 2, 7, 8, 11, 12, 13, 14, 19];
  centerCols.forEach(function(colIndex) {
    sheet.getRange(rowNum, colIndex).setHorizontalAlignment("center");
  });
  
  // Format Status label cleanly with elegant pill background emulation
  const statusCell = sheet.getRange(rowNum, 20);
  const statusVal = "" + statusCell.getValue();
  statusCell.setFontWeight("bold")
            .setHorizontalAlignment("center");
            
  if (statusVal === "Enrolled" || statusVal === "Verified") {
    statusCell.setBackground(THEME.emeraldTint)
              .setFontColor(THEME.emeraldText);
  } else if (statusVal === "Pending") {
    statusCell.setBackground(THEME.statusPendingBg)
              .setFontColor(THEME.statusPendingText);
  } else {
    statusCell.setBackground("#E2E8F0")
              .setFontColor("#334155"); // Gray neutral
  }
  
  // Add subtle light gray cell borders to prevent visual grid blurring
  rowRange.setBorder(true, true, true, true, true, true, "#E2E8F0", SpreadsheetApp.BorderStyle.SOLID);
}

/**
 * Resizes sheet columns with proportional safe-buffer spacing to eliminate "###" truncating.
 */
function autoFitColumns(sheet) {
  const colCount = HEADERS.length;
  sheet.autoResizeColumns(1, colCount);
  
  // Add 12px manual padding buffer onto each calculated auto width for comfortable negative-space gaps
  for (let c = 1; c <= colCount; c++) {
    const currentWidth = sheet.getColumnWidth(c);
    sheet.setColumnWidth(c, Math.max(currentWidth + 15, 80));
  }
}

/**
 * Standard utility wrappers returning properly constructed CORS preflight responsive JSON.
 */
function createSuccessResponse(msg) {
  const response = { status: "success", message: msg, timestamp: new Date().toISOString() };
  return ContentService.createTextOutput(JSON.stringify(response))
    .setMimeType(ContentService.MimeType.JSON)
    .setHeader("Access-Control-Allow-Origin", "*")
    .setHeader("Access-Control-Allow-Headers", "Content-Type");
}

function createErrorResponse(errorDesc) {
  const response = { status: "error", error: errorDesc, timestamp: new Date().toISOString() };
  return ContentService.createTextOutput(JSON.stringify(response))
    .setMimeType(ContentService.MimeType.JSON)
    .setHeader("Access-Control-Allow-Origin", "*")
    .setHeader("Access-Control-Allow-Headers", "Content-Type");
}
