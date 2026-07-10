
/* =========================================================================
    NAVIGATION CONFIG
========================================================================= */
const NAV = [
  { id:'dashboard', label:'Dashboard', icon:'fa-gauge-high', children:[
      { id:'dash-operational', label:'Operational' },
      { id:'dash-executive', label:'Executive' },
      { id:'dash-movement', label:'Document Movement Monitoring' },
  ]},
  { id:'docmgmt', label:'Document Management', icon:'fa-folder-open', children:[
      { id:'doc-registration', label:'Document Registration' },
      { id:'doc-classification', label:'Document Classification' },
      { id:'doc-barcode-gen', label:'Barcode Generation' },
      { id:'doc-barcode-enc', label:'Barcode Encoding' },
      { id:'doc-barcode-scan', label:'Barcode Scanning' },
      { id:'doc-checkinout', label:'Check-In / Check-Out' },
      { id:'doc-routing', label:'Document Routing' },
      { id:'doc-status', label:'Status Monitoring' },
      { id:'doc-grouping', label:'Document Grouping' },
      { id:'doc-attachment', label:'Attachment Management' },
  ]},
  { id:'workflow', label:'Workflow Management', icon:'fa-diagram-project', children:[
      { id:'wf-routing', label:'Routing Workflow' },
      { id:'wf-assignment', label:'User Assignment' },
      { id:'wf-approval', label:'Approval Workflow' },
      { id:'wf-lifecycle', label:'Document Lifecycle Tracking' },
  ]},

  { id:'usermgmt', label:'User Management', icon:'fa-users', children:[
      { id:'user-registration', label:'User Registration' },
      { id:'user-role', label:'Role Management' },
      { id:'user-permission', label:'Permission Management' },
      { id:'user-menu', label:'Menu Management' },
  ]},
  { id:'reporting', label:'Reporting', icon:'fa-chart-column', children:[
      { id:'rpt-operational', label:'Operational Reports' },
      { id:'rpt-timemotion', label:'Time & Motion Analysis' },
      { id:'rpt-turnaround', label:'Turnaround Reports' },
      { id:'rpt-outstanding', label:'Outstanding Documents' },
      { id:'rpt-export', label:'Export to Excel / PDF' },
      { id:'rpt-inventory', label:'System Inventory Report' },
  ]},
  { id:'admin', label:'Administration', icon:'fa-gear', children:[
      { id:'admin-config', label:'Configuration' },
      { id:'admin-params', label:'System Parameters' },
      { id:'admin-audit', label:'Audit Logs' },
  ]},
];

const CRUMB = {}; // leafId -> {parentLabel, label}
NAV.forEach(top=>{ (top.children||[]).forEach(c=>{ CRUMB[c.id] = {parent:top.label, label:c.label}; }); });

/* =========================================================================
   HARDCODED DATA — PAGE DEFINITIONS
========================================================================= */
const STATUS_CLASS = {
  'Active':'good','Registered':'info','Draft':'neutral','Approved':'good','Rejected':'bad',
  'Pending':'warn','Pending Review':'warn','Checked In':'good','Checked Out':'info','In Transit':'warn',
  'Delivered':'good','Received':'good','On Track':'good','At Risk':'warn','Overdue':'bad','Sent':'good',
  'Failed':'bad','Queued':'warn','Success':'good','Not Found':'bad','Duplicate':'warn','Encoded':'good',
  'Generated':'good','Completed':'good','Filed':'good','Escalated':'bad','Inactive':'neutral','Visible':'good',
  'Hidden':'neutral','Full Access':'good','Locked':'bad','Unauthorized':'bad','Denied':'bad','Public':'info',
  'Internal':'neutral','Confidential':'warn','Restricted':'bad','View Only':'info','Enabled':'good','Disabled':'bad'
};
function badge(val){
  const cls = STATUS_CLASS[val] || 'neutral';
  return `<span class="badge ${cls}">${val}</span>`;
}

const DEPTS = ['Finance','Human Resources','Procurement','Legal Affairs','IT Services','Operations','Executive Office'];
const PEOPLE = ['Maria Santos','Drew Venegas','Arcel Reyes','Liza Fernandez','Paolo Cruz','Nathan Ong','Grace Villanueva','Ramon Torres'];

function buildRows(n, gen){ return Array.from({length:n}, (_,i)=>gen(i+1)); }

const PAGES = {

/* ---------------- DOCUMENT MANAGEMENT ---------------- */
'doc-registration': {
  title:'Document Registration', desc:'Register new documents into the DMS and capture core metadata before they enter the workflow.',
  columns:[
    {key:'id',label:'Doc ID'},{key:'name',label:'Document Name'},{key:'type',label:'Document Type'},
    {key:'dept',label:'Registered By'},{key:'date',label:'Date Registered'},{key:'status',label:'Status',badge:true}
  ],
  rows: buildRows(9,i=>({id:'DOC-'+(2026000+i), name:['Purchase Order','Service Contract','Memo Circular','Board Resolution','Lease Agreement','Travel Order','Inspection Report','Deed of Sale','Client Proposal'][i-1]+' No. '+(400+i), type:['Financial','Contract','Memo','Resolution','Contract','Memo','Report','Contract','Proposal'][i-1], dept:PEOPLE[i%PEOPLE.length], date:'2026-07-'+String(9-Math.min(i,8)).padStart(2,'0'), status:['Registered','Draft','Registered','Active','Registered','Draft','Active','Registered','Draft'][i-1] })),
  formFields:[
    {key:'name',label:'Document Name',type:'text',placeholder:'e.g. Purchase Order No. 445'},
    {key:'type',label:'Document Type',type:'select',options:['Financial','Contract','Memo','Resolution','Report','Proposal']},
    {key:'dept',label:'Department',type:'select',options:DEPTS},
    {key:'confidentiality',label:'Confidentiality',type:'select',options:['Public','Internal','Confidential','Restricted']},
    {key:'desc',label:'Description',type:'textarea',placeholder:'Brief description of this document…'},
  ]
},
'doc-classification': {
  title:'Document Classification', desc:'Organize documents into categories and classification levels for controlled access and retention.',
  columns:[{key:'id',label:'Doc ID'},{key:'name',label:'Document Name'},{key:'category',label:'Category'},{key:'level',label:'Classification',badge:true},{key:'retention',label:'Retention Period'},{key:'by',label:'Classified By'}],
  rows: buildRows(8,i=>({id:'DOC-'+(2026010+i), name:['HR Policy Manual','Financial Statement Q2','NDA — Vendor Corp','Executive Meeting Minutes','Payroll Records','IT Security Policy','Client Contract A19','Audit Findings'][i-1], category:['Policy','Finance','Legal','Governance','HR','IT','Legal','Audit'][i-1], level:['Internal','Confidential','Restricted','Confidential','Restricted','Internal','Confidential','Restricted'][i-1], retention:['5 years','7 years','3 years','10 years','7 years','5 years','5 years','10 years'][i-1], by:PEOPLE[i%PEOPLE.length] })),
  formFields:[
    {key:'name',label:'Document',type:'text',placeholder:'Select or type document name'},
    {key:'category',label:'Category',type:'select',options:['Policy','Finance','Legal','Governance','HR','IT','Audit']},
    {key:'level',label:'Classification Level',type:'select',options:['Public','Internal','Confidential','Restricted']},
    {key:'retention',label:'Retention Period',type:'text',placeholder:'e.g. 5 years'},
  ]
},
'doc-barcode-gen': {
  title:'Barcode Generation', desc:'Generate QR Code or RFID barcodes for registered documents to enable physical and digital tracking.',
  columns:[{key:'id',label:'Doc ID'},{key:'name',label:'Document Name'},{key:'type',label:'Barcode Type'},{key:'value',label:'Barcode Value'},{key:'date',label:'Generated Date'},{key:'status',label:'Status',badge:true}],
  rows: buildRows(7,i=>({id:'DOC-'+(2026020+i), name:['Purchase Order No. 445','Lease Agreement 2026-08','Board Resolution 019','Travel Order TO-118','Contract CA-2026-089','Invoice INV-2026-1123','Deed of Sale DS-044'][i-1], type: i%2===0?'RFID':'QR Code', value:(i%2===0?'RFID-':'QR-')+ (883200+i*17), date:'2026-07-0'+((i%8)+1), status:['Generated','Generated','Pending','Generated','Generated','Pending','Generated'][i-1] })),
  formFields:[
    {key:'doc',label:'Document',type:'select',options:['Purchase Order No. 445','Lease Agreement 2026-08','Board Resolution 019','Travel Order TO-118']},
    {key:'type',label:'Barcode Type',type:'select',options:['QR Code','RFID']},
    {key:'notes',label:'Notes',type:'textarea',placeholder:'Optional notes for this barcode…'},
  ]
},
'doc-barcode-enc': {
  title:'Barcode Encoding', desc:'Encode document metadata into generated QR Code / RFID tags for scanning devices to read.',
  columns:[{key:'id',label:'Doc ID'},{key:'value',label:'Barcode Value'},{key:'format',label:'Encoding Format'},{key:'size',label:'Data Size'},{key:'by',label:'Encoded By'},{key:'status',label:'Status',badge:true}],
  rows: buildRows(6,i=>({id:'DOC-'+(2026020+i), value:(i%2===0?'RFID-':'QR-')+(883200+i*17), format:i%2===0?'NDEF (RFID)':'Base64 (QR)', size:(1.2+i*0.3).toFixed(1)+' KB', by:PEOPLE[i%PEOPLE.length], status:['Encoded','Encoded','Failed','Encoded','Encoded','Encoded'][i-1] })),
  formFields:[
    {key:'value',label:'Barcode Value',type:'text',placeholder:'e.g. QR-883217'},
    {key:'format',label:'Encoding Format',type:'select',options:['Base64 (QR)','NDEF (RFID)','ASCII']},
  ]
},
'doc-barcode-scan': {
  title:'Barcode Scanning', desc:'Scan logs from QR Code and RFID readers used to check documents in, out, or verify authenticity.',
  columns:[{key:'id',label:'Scan ID'},{key:'value',label:'Barcode Value'},{key:'name',label:'Document Name'},{key:'by',label:'Scanned By'},{key:'station',label:'Station'},{key:'date',label:'Scan Date'},{key:'result',label:'Result',badge:true}],
  rows: buildRows(8,i=>({id:'SCN-'+(5000+i), value:'QR-'+(883200+i*11), name:['Purchase Order No. 445','Invoice INV-2026-1123','Contract CA-2026-089','Memo Circular 404','Deed of Sale DS-044','Travel Order TO-118','Board Resolution 019','HR Policy Manual'][i-1], by:PEOPLE[i%PEOPLE.length], station:['Records Room','Finance Desk','Legal Desk','Front Lobby','Archive Vault','HR Office','Records Room','Finance Desk'][i-1], date:'2026-07-09 '+(8+i)+':1'+i+' AM', result:['Success','Success','Duplicate','Success','Not Found','Success','Success','Success'][i-1] })),
  formFields:[
    {key:'value',label:'Barcode Value',type:'text',placeholder:'Scan or type barcode value'},
    {key:'station',label:'Station',type:'select',options:['Records Room','Finance Desk','Legal Desk','Front Lobby','Archive Vault','HR Office']},
  ]
},
'doc-checkinout': {
  title:'Document Check-In / Check-Out', desc:'Track when physical or digital documents leave and return to the records room.',
  columns:[{key:'id',label:'Doc ID'},{key:'name',label:'Document Name'},{key:'action',label:'Action',badge:true},{key:'by',label:'Handled By'},{key:'loc',label:'Location'},{key:'date',label:'Date / Time'}],
  rows: buildRows(10,i=>({id:'DOC-'+(2026030+i), name:['Contract CA-2026-089','Invoice INV-2026-1123','Board Resolution 019','Lease Agreement 2026-08','HR Policy Manual','Audit Findings Q2','Travel Order TO-118','Deed of Sale DS-044','Payroll Records June','NDA — Vendor Corp'][i-1], action: i%3===0?'Checked Out':'Checked In', by:PEOPLE[i%PEOPLE.length], loc:DEPTS[i%DEPTS.length], date:'2026-07-09 '+(8+i)+':2'+i+' AM' })),
  formFields:[
    {key:'doc',label:'Document',type:'text',placeholder:'e.g. Contract CA-2026-089'},
    {key:'action',label:'Action',type:'select',options:['Checked In','Checked Out']},
    {key:'loc',label:'Location',type:'select',options:DEPTS},
  ]
},
'doc-routing': {
  title:'Document Routing', desc:'Move documents between departments as part of review, approval, or filing processes.',
  columns:[{key:'id',label:'Doc ID'},{key:'name',label:'Document Name'},{key:'from',label:'From'},{key:'to',label:'To'},{key:'by',label:'Routed By'},{key:'date',label:'Date Routed'},{key:'status',label:'Status',badge:true}],
  rows: buildRows(8,i=>({id:'DOC-'+(2026040+i), name:['Purchase Order No. 445','Memo Circular 404','Contract CA-2026-089','Travel Order TO-118','Board Resolution 019','Invoice INV-2026-1123','Lease Agreement 2026-08','Audit Findings Q2'][i-1], from:DEPTS[i%DEPTS.length], to:DEPTS[(i+2)%DEPTS.length], by:PEOPLE[i%PEOPLE.length], date:'2026-07-0'+((i%8)+1), status:['In Transit','Delivered','Received','In Transit','Delivered','Received','Delivered','In Transit'][i-1] })),
  formFields:[
    {key:'doc',label:'Document',type:'text',placeholder:'e.g. Purchase Order No. 445'},
    {key:'from',label:'From Department',type:'select',options:DEPTS},
    {key:'to',label:'To Department',type:'select',options:DEPTS},
  ]
},
'doc-status': {
  title:'Document Status Monitoring', desc:'Monitor where every active document currently stands against its expected turnaround.',
  columns:[{key:'id',label:'Doc ID'},{key:'name',label:'Document Name'},{key:'current',label:'Current Status',badge:true},{key:'holder',label:'Current Holder'},{key:'days',label:'Days in Status'},{key:'sla',label:'SLA',badge:true}],
  rows: buildRows(9,i=>({id:'DOC-'+(2026050+i), name:['Contract CA-2026-089','Invoice INV-2026-1123','Board Resolution 019','Travel Order TO-118','Lease Agreement 2026-08','Memo Circular 404','Deed of Sale DS-044','Purchase Order No. 445','HR Policy Manual'][i-1], current:['Pending Review','Approved','In Transit','Pending Review','Filed','Draft','Pending Review','Approved','Filed'][i-1], holder:PEOPLE[i%PEOPLE.length], days:(i*1.3).toFixed(0), sla:['At Risk','On Track','On Track','Overdue','On Track','At Risk','On Track','On Track','On Track'][i-1] }))
},
'doc-grouping': {
  title:'Document Grouping', desc:'Bundle related documents into groups such as projects, cases, or batches for easier handling.',
  columns:[{key:'id',label:'Group ID'},{key:'name',label:'Group Name'},{key:'count',label:'Document Count'},{key:'type',label:'Group Type'},{key:'by',label:'Created By'},{key:'date',label:'Date Created'}],
  rows: buildRows(6,i=>({id:'GRP-'+(300+i), name:['Q2 2026 Financial Closing','Vendor Onboarding — Corp A19','Office Lease Renewal Batch','HR Compliance Case #14','2026 Board Resolutions','IT Security Audit Bundle'][i-1], count:[12,7,4,9,15,6][i-1], type:['Batch','Case','Project','Case','Batch','Project'][i-1], by:PEOPLE[i%PEOPLE.length], date:'2026-06-'+(20+i) })),
  formFields:[
    {key:'name',label:'Group Name',type:'text',placeholder:'e.g. Q3 2026 Financial Closing'},
    {key:'type',label:'Group Type',type:'select',options:['Batch','Case','Project']},
  ]
},
'doc-attachment': {
  title:'Attachment Management', desc:'Manage supporting files attached to registered documents such as scans, images, and exhibits.',
  columns:[{key:'id',label:'Attachment ID'},{key:'file',label:'File Name'},{key:'linked',label:'Linked Document'},{key:'type',label:'File Type'},{key:'size',label:'File Size'},{key:'by',label:'Uploaded By'}],
  rows: buildRows(7,i=>({id:'ATT-'+(9000+i), file:['scan_001.pdf','id_photo.jpg','signed_contract.pdf','receipt_scan.png','exhibit_A.pdf','floor_plan.dwg','notarized_copy.pdf'][i-1], linked:['Contract CA-2026-089','HR Policy Manual','Lease Agreement 2026-08','Invoice INV-2026-1123','Board Resolution 019','Lease Agreement 2026-08','Deed of Sale DS-044'][i-1], type:['PDF','JPG','PDF','PNG','PDF','DWG','PDF'][i-1], size:(0.4+i*0.6).toFixed(1)+' MB', by:PEOPLE[i%PEOPLE.length] })),
  formFields:[
    {key:'file',label:'File Name',type:'text',placeholder:'e.g. signed_contract.pdf'},
    {key:'linked',label:'Linked Document',type:'text',placeholder:'e.g. Contract CA-2026-089'},
  ]
},

/* ---------------- WORKFLOW MANAGEMENT ---------------- */
'wf-routing': {
  title:'Routing Workflow', desc:'Define the department-to-department path a document type follows from creation to filing.',
  columns:[{key:'id',label:'Workflow ID'},{key:'name',label:'Workflow Name'},{key:'trigger',label:'Trigger Document Type'},{key:'steps',label:'Steps'},{key:'status',label:'Status',badge:true},{key:'mod',label:'Last Modified'}],
  rows: buildRows(6,i=>({id:'WF-'+(100+i), name:['Standard Contract Route','Invoice Approval Route','HR Policy Review Route','Procurement Route','Executive Memo Route','Legal Clearance Route'][i-1], trigger:['Contract','Financial','Policy','Purchase Order','Memo','Legal'][i-1], steps:[4,3,5,4,2,5][i-1], status:['Active','Active','Inactive','Active','Active','Active'][i-1], mod:'2026-06-2'+i }))
},
'wf-assignment': {
  title:'User Assignment', desc:'Assign specific documents to responsible users or roles at each workflow stage.',
  columns:[{key:'id',label:'Assignment ID'},{key:'doc',label:'Document'},{key:'assignee',label:'Assigned To'},{key:'role',label:'Assigned Role'},{key:'due',label:'Due Date'},{key:'status',label:'Status',badge:true}],
  rows: buildRows(8,i=>({id:'ASG-'+(700+i), doc:['Contract CA-2026-089','Invoice INV-2026-1123','Board Resolution 019','Travel Order TO-118','Lease Agreement 2026-08','Memo Circular 404','Deed of Sale DS-044','Purchase Order No. 445'][i-1], assignee:PEOPLE[i%PEOPLE.length], role:['Reviewer','Approver','Reviewer','Approver','Reviewer','Approver','Reviewer','Approver'][i-1], due:'2026-07-'+(10+i), status:['Pending','Completed','Pending','Overdue','Completed','Pending','Completed','Pending'][i-1] })),
  formFields:[
    {key:'doc',label:'Document',type:'text',placeholder:'e.g. Contract CA-2026-089'},
    {key:'assignee',label:'Assigned To',type:'select',options:PEOPLE},
    {key:'role',label:'Assigned Role',type:'select',options:['Reviewer','Approver','Encoder']},
    {key:'due',label:'Due Date',type:'text',placeholder:'YYYY-MM-DD'},
  ]
},
'wf-approval': {
  title:'Approval Workflow', desc:'Track multi-level approval decisions made across the document lifecycle.',
  columns:[{key:'id',label:'Approval ID'},{key:'doc',label:'Document'},{key:'approver',label:'Approver'},{key:'level',label:'Approval Level'},{key:'decision',label:'Decision',badge:true},{key:'date',label:'Date Decided'}],
  rows: buildRows(7,i=>({id:'APR-'+(200+i), doc:['Contract CA-2026-089','Invoice INV-2026-1123','Board Resolution 019','Lease Agreement 2026-08','Purchase Order No. 445','Travel Order TO-118','Deed of Sale DS-044'][i-1], approver:PEOPLE[i%PEOPLE.length], level:['Level 1','Level 2','Level 1','Level 2','Level 1','Level 1','Level 2'][i-1], decision:['Approved','Pending','Approved','Rejected','Approved','Pending','Approved'][i-1], date:'2026-07-0'+((i%8)+1) }))
},
'wf-lifecycle': {
  title:'Document Lifecycle Tracking', desc:'Follow each document through its full lifecycle from draft to archive.',
  columns:[{key:'id',label:'Doc ID'},{key:'name',label:'Document Name'},{key:'stage',label:'Current Stage'},{key:'progress',label:'Progress'},{key:'updated',label:'Last Updated'}],
  rows: buildRows(6,i=>({id:'DOC-'+(2026060+i), name:['Contract CA-2026-089','Invoice INV-2026-1123','Board Resolution 019','Lease Agreement 2026-08','Purchase Order No. 445','HR Policy Manual'][i-1], stage:['Review','Approval','Filed','Draft','Approval','Archived'][i-1], progress:[55,80,100,20,75,100][i-1], updated:'2026-07-0'+((i%8)+1) }))
},

/* ---------------- USER MANAGEMENT ---------------- */
'user-registration': {
  title:'User Registration', desc:'Manage user accounts that have access to the Document Management System.',
  columns:[{key:'id',label:'User ID'},{key:'name',label:'Full Name'},{key:'username',label:'Username'},{key:'dept',label:'Department'},{key:'role',label:'Role'},{key:'status',label:'Status',badge:true}],
  rows: buildRows(8,i=>({id:'USR-'+(1000+i), name:PEOPLE[i-1]||('User '+i), username:(PEOPLE[i-1]||('user'+i)).toLowerCase().replace(' ','.'), dept:DEPTS[i%DEPTS.length], role:['Administrator','Encoder','Reviewer','Approver','Encoder','Reviewer','Administrator','Encoder'][i-1], status:['Active','Active','Active','Inactive','Active','Active','Active','Inactive'][i-1] })),
  formFields:[
    {key:'name',label:'Full Name',type:'text',placeholder:'e.g. Juan Dela Cruz'},
    {key:'username',label:'Username',type:'text',placeholder:'e.g. juan.delacruz'},
    {key:'dept',label:'Department',type:'select',options:DEPTS},
    {key:'role',label:'Role',type:'select',options:['Administrator','Encoder','Reviewer','Approver']},
  ]
},
'user-role': {
  title:'Role Management', desc:'Define user roles and see how many users and permissions are attached to each.',
  columns:[{key:'id',label:'Role ID'},{key:'name',label:'Role Name'},{key:'desc',label:'Description'},{key:'users',label:'Users Assigned'},{key:'perms',label:'Permissions'},{key:'status',label:'Status',badge:true}],
  rows: buildRows(5,i=>({id:'ROLE-'+(10+i), name:['Administrator','Encoder','Reviewer','Approver','Auditor'][i-1], desc:['Full system access','Registers & encodes documents','Reviews routed documents','Approves at final stage','Read-only audit access'][i-1], users:[2,6,5,4,3][i-1], perms:[24,12,9,7,5][i-1], status:'Active' })),
  formFields:[
    {key:'name',label:'Role Name',type:'text',placeholder:'e.g. Supervisor'},
    {key:'desc',label:'Description',type:'textarea',placeholder:'What this role is for…'},
  ]
},
'user-permission': {
  title:'Permission Management', desc:'Control which access level each role has across every module.',
  columns:[{key:'id',label:'Permission ID'},{key:'name',label:'Permission Name'},{key:'module',label:'Module'},{key:'level',label:'Access Level',badge:true},{key:'roles',label:'Assigned Roles'}],
  rows: buildRows(7,i=>({id:'PERM-'+(50+i), name:['Manage Documents','Approve Documents','View Reports','Manage Users','Configure System','View Audit Logs','Manage Workflows'][i-1], module:['Document Mgmt','Workflow Mgmt','Reporting','User Mgmt','Administration','Administration','Workflow Mgmt'][i-1], level:['Full Access','Full Access','View Only','Full Access','Full Access','View Only','Full Access'][i-1], roles:['Administrator, Encoder','Approver, Administrator','All Roles','Administrator','Administrator','Auditor, Administrator','Administrator, Reviewer'][i-1] }))
},
'user-menu': {
  title:'Menu Management', desc:'Control which navigation items appear in the sidebar and their display order.',
  columns:[{key:'id',label:'Menu ID'},{key:'name',label:'Menu Name'},{key:'parent',label:'Parent Menu'},{key:'order',label:'Order'},{key:'visibility',label:'Visibility',badge:true}],
  rows: NAV.flatMap((top,ti)=>[{id:'MNU-'+(ti+1)+'0', name:top.label, parent:'—', order:ti+1, visibility:'Visible'}].concat((top.children||[]).map((c,ci)=>({id:'MNU-'+(ti+1)+(ci+1), name:c.label, parent:top.label, order:ci+1, visibility: (ti===3&&ci===3)?'Hidden':'Visible'}))))
},

/* ---------------- REPORTING ---------------- */
'rpt-operational': {
  title:'Operational Reports', desc:'Day-to-day operational summaries for each department.',
  columns:[{key:'id',label:'Report ID'},{key:'name',label:'Report Name'},{key:'dept',label:'Department'},{key:'range',label:'Date Range'},{key:'by',label:'Generated By'},{key:'date',label:'Date Generated'}],
  rows: buildRows(6,i=>({id:'RPT-'+(400+i), name:['Weekly Document Volume','Monthly Check-In/Out Log','Routing Turnaround Summary','Pending Approvals Snapshot','Department Backlog Report','Barcode Scan Summary'][i-1], dept:DEPTS[i%DEPTS.length], range:'Jul 01 – Jul 09, 2026', by:PEOPLE[i%PEOPLE.length], date:'2026-07-09' }))
},
'rpt-timemotion': {
  title:'Time & Motion Analysis', desc:'Compare average time spent at each stage against target processing time.',
  columns:[{key:'id',label:'Doc ID'},{key:'stage',label:'Stage'},{key:'avg',label:'Avg Time Spent'},{key:'target',label:'Target Time'},{key:'variance',label:'Variance'}],
  rows: buildRows(6,i=>({id:'DOC-'+(2026070+i), stage:['Registration','Review','Approval','Routing','Filing','Encoding'][i-1], avg:[0.5,2.4,1.8,1.1,0.4,0.6][i-1]+' days', target:[0.5,1.5,1.0,0.5,0.5,0.5][i-1]+' days', variance: (( [0.5,2.4,1.8,1.1,0.4,0.6][i-1] - [0.5,1.5,1.0,0.5,0.5,0.5][i-1]) >=0 ? '+':'') + (( [0.5,2.4,1.8,1.1,0.4,0.6][i-1] - [0.5,1.5,1.0,0.5,0.5,0.5][i-1]).toFixed(1)) +' days' }))
},
'rpt-turnaround': {
  title:'Turnaround Reports', desc:'Measure how long documents take from receipt to completion against SLA.',
  columns:[{key:'id',label:'Doc ID'},{key:'name',label:'Document Name'},{key:'received',label:'Date Received'},{key:'completed',label:'Date Completed'},{key:'turnaround',label:'Turnaround'},{key:'sla',label:'SLA',badge:true}],
  rows: buildRows(6,i=>({id:'DOC-'+(2026080+i), name:['Contract CA-2026-089','Invoice INV-2026-1123','Board Resolution 019','Travel Order TO-118','Purchase Order No. 445','Deed of Sale DS-044'][i-1], received:'2026-06-2'+i, completed:'2026-07-0'+((i%8)+1), turnaround:(3+i)+' days', sla:['On Track','On Track','Overdue','On Track','At Risk','On Track'][i-1] }))
},
'rpt-outstanding': {
  title:'Outstanding Documents', desc:'Documents that remain unresolved beyond their expected completion date.',
  columns:[{key:'id',label:'Doc ID'},{key:'name',label:'Document Name'},{key:'holder',label:'Current Holder'},{key:'days',label:'Days Outstanding'},{key:'status',label:'Status',badge:true}],
  rows: buildRows(5,i=>({id:'DOC-'+(2026090+i), name:['Travel Order TO-118','Memo Circular 404','Lease Agreement 2026-08','Invoice INV-2026-1123','Contract CA-2026-089'][i-1], holder:PEOPLE[i%PEOPLE.length], days:[9,4,12,2,6][i-1], status:['Overdue','Pending','Overdue','Pending','Pending'][i-1] }))
},
'rpt-inventory': {
  title:'System Inventory Report', desc:'Department-level snapshot of total documents and their current status distribution.',
  columns:[{key:'dept',label:'Department'},{key:'total',label:'Total Documents'},{key:'checkedin',label:'Checked In'},{key:'checkedout',label:'Checked Out'},{key:'pending',label:'Pending'},{key:'overdue',label:'Overdue'}],
  rows: DEPTS.map((d,i)=>({dept:d, total:[212,178,96,134,89,201,64][i], checkedin:[180,150,70,110,72,165,50][i], checkedout:[18,15,14,12,9,20,8][i], pending:[10,9,8,8,6,12,5][i], overdue:[4,4,4,4,2,4,1][i]}))
},

/* ---------------- ADMINISTRATION ---------------- */
'admin-params': {
  title:'System Parameters', desc:'Key operating parameters that control DMS-wide behavior.',
  columns:[{key:'id',label:'Parameter ID'},{key:'name',label:'Parameter Name'},{key:'value',label:'Value'},{key:'desc',label:'Description'},{key:'updated',label:'Last Updated'}],
  rows: buildRows(6,i=>({id:'PARAM-'+(20+i), name:['Max Attachment Size','Default Retention Period','Session Timeout','Barcode Format','Escalation Threshold','SLA Warning Threshold'][i-1], value:['25 MB','5 years','30 minutes','QR Code','3 days overdue','80% of SLA'][i-1], desc:['Maximum file size per attachment','Default retention for new documents','Idle session length before logout','Default barcode type for new docs','Days overdue before auto-escalation','Point at which a document is At Risk'][i-1], updated:'2026-06-2'+i }))
},
'admin-audit': {
  title:'Audit Logs', desc:'Complete trail of user actions performed across the system for accountability and compliance.',
  columns:[{key:'id',label:'Log ID'},{key:'user',label:'User'},{key:'action',label:'Action'},{key:'module',label:'Module'},{key:'date',label:'Date / Time'},{key:'ip',label:'IP Address'}],
  rows: buildRows(10,i=>({id:'LOG-'+(90000+i), user:PEOPLE[i%PEOPLE.length], action:['Checked in document','Approved document','Registered new document','Updated user role','Generated barcode','Exported report','Rejected document','Routed document','Updated system parameter','Scanned barcode'][i-1], module:['Document Mgmt','Workflow Mgmt','Document Mgmt','User Mgmt','Document Mgmt','Reporting','Workflow Mgmt','Document Mgmt','Administration','Document Mgmt'][i-1], date:'2026-07-09 '+(7+i)+':0'+i+' AM', ip:'192.168.1.'+(10+i) }))
},
};

/* =========================================================================
   STATE
========================================================================= */
let currentPage = 'dash-operational';
const tableState = {}; // per-page: {rows,sortKey,sortDir,page,query}

function getState(pageId){
  if(!tableState[pageId]){
    tableState[pageId] = { rows: JSON.parse(JSON.stringify(PAGES[pageId].rows)), sortKey:null, sortDir:1, page:1, query:'' };
  }
  return tableState[pageId];
}

/* =========================================================================
   SIDEBAR RENDER
========================================================================= */
function renderSidebar(){
  const root = document.getElementById('navRoot');
  root.innerHTML = NAV.map(top=>{
    const hasChildren = top.children && top.children.length;
    const isActiveParent = hasChildren && top.children.some(c=>c.id===currentPage);
    return `
    <div class="nav-item ${isActiveParent?'expanded has-active':''}" data-top="${top.id}">
      <div class="nav-link ${isActiveParent?'active-parent':''}" onclick="onTopClick('${top.id}')">
        <i class="fa-solid ${top.icon} icon"></i>
        <span>${top.label}</span>
        ${hasChildren?'<i class="fa-solid fa-chevron-down chev"></i>':''}
      </div>
      ${hasChildren?`<div class="submenu">
        ${top.children.map(c=>`<div class="sub-link ${c.id===currentPage?'active':''}" onclick="event.stopPropagation();navigateTo('${c.id}')">
          <i class="fa-solid fa-circle"></i><span>${c.label}</span>
        </div>`).join('')}
      </div>`:''}
    </div>`;
  }).join('');
}

function onTopClick(topId){
  const top = NAV.find(t=>t.id===topId);
  if(top.children && top.children.length){
    const el = document.querySelector(`.nav-item[data-top="${topId}"]`);
    el.classList.toggle('expanded');
  } else {
    navigateTo(topId);
  }
}

function navigateTo(pageId){
  currentPage = pageId;
  renderSidebar();
  // re-expand the parent of the page we just opened
  const parentTop = NAV.find(t=> (t.children||[]).some(c=>c.id===pageId));
  if(parentTop){
    const el = document.querySelector(`.nav-item[data-top="${parentTop.id}"]`);
    if(el) el.classList.add('expanded');
  }
  const crumb = CRUMB[pageId];
  document.getElementById('topTitle').textContent = crumb ? crumb.label : 'Dashboard';
  document.getElementById('topCrumb').textContent = crumb ? crumb.parent + ' / ' + crumb.label : 'Dashboard';
  renderPage(pageId);
  document.getElementById('content').scrollTop = 0;
  window.scrollTo({top:0,behavior:'smooth'});
}

/* =========================================================================
   TOAST
========================================================================= */
function showToast(msg, type='good', icon='fa-circle-check'){
  const root = document.getElementById('toastRoot');
  const el = document.createElement('div');
  el.className = 'toast '+(type==='good'?'':type);
  el.innerHTML = `<i class="fa-solid ${icon}" style="color:var(--${type})"></i><span>${msg}</span>`;
  root.appendChild(el);
  setTimeout(()=>{ el.classList.add('fadeout'); setTimeout(()=>el.remove(),300); }, 2800);
}

/* =========================================================================
   MODAL HELPERS
========================================================================= */
function openModal(html){
  const root = document.getElementById('modalRoot');
  root.innerHTML = `<div class="modal-overlay" onclick="if(event.target===this)closeModal()"><div class="modal">${html}</div></div>`;
}
function closeModal(){ document.getElementById('modalRoot').innerHTML=''; }

function fieldHtml(f, idx){
  const id = 'f_'+idx;
  if(f.type==='select'){
    return `<div class="field"><label>${f.label}</label><select id="${id}">${f.options.map(o=>`<option value="${o}">${o}</option>`).join('')}</select></div>`;
  }
  if(f.type==='textarea'){
    return `<div class="field"><label>${f.label}</label><textarea id="${id}" placeholder="${f.placeholder||''}"></textarea></div>`;
  }
  return `<div class="field"><label>${f.label}</label><input id="${id}" type="text" placeholder="${f.placeholder||''}"></div>`;
}

function openAddModal(pageId){
  const page = PAGES[pageId];
  const fields = page.formFields || [];
  openModal(`
    <div class="modal-head"><h3><i class="fa-solid fa-plus" style="color:var(--accent);margin-right:8px;"></i>Add ${page.title.replace(/s$/,'')}</h3><button class="close-x" onclick="closeModal()"><i class="fa-solid fa-xmark"></i></button></div>
    <div class="modal-body">
      ${fields.length ? fields.map(fieldHtml).join('') : `<p style="color:var(--muted);font-size:13px;">No additional fields required for this entry.</p>`}
    </div>
    <div class="modal-foot">
      <button class="btn btn-ghost" onclick="closeModal()">Cancel</button>
      <button class="btn btn-primary" onclick="submitAdd('${pageId}')"><i class="fa-solid fa-check"></i> Save Entry</button>
    </div>
  `);
}

function submitAdd(pageId){
  const page = PAGES[pageId];
  const st = getState(pageId);
  const fields = page.formFields || [];
  const newRow = {};
  fields.forEach((f,idx)=>{ const el = document.getElementById('f_'+idx); newRow[f.key] = el.value || '—'; });
  // fill in required columns not covered by form with sensible defaults
  page.columns.forEach(c=>{
    if(newRow[c.key] === undefined){
      if(c.key==='id') newRow.id = genId(pageId);
      else if(c.key.toLowerCase().includes('date')) newRow[c.key] = '2026-07-09';
      else if(c.badge) newRow[c.key] = defaultStatusFor(pageId);
      else newRow[c.key] = '—';
    }
  });
  if(!newRow.id) newRow.id = genId(pageId);
  st.rows.unshift(newRow);
  st._justAdded = newRow.id || newRow.name;
  st.page = 1;
  closeModal();
  renderTablePage(pageId);
  showToast('New entry added successfully.', 'good', 'fa-circle-check');
}

function genId(pageId){
  return 'NEW-' + Math.floor(1000+Math.random()*9000);
}
function defaultStatusFor(pageId){
  return 'Pending';
}

function openViewModal(pageId, rowIndexOnPage){
  const st = getState(pageId);
  const row = st._pageRows[rowIndexOnPage];
  const page = PAGES[pageId];
  openModal(`
    <div class="modal-head"><h3><i class="fa-regular fa-eye" style="color:var(--info);margin-right:8px;"></i>Record Details</h3><button class="close-x" onclick="closeModal()"><i class="fa-solid fa-xmark"></i></button></div>
    <div class="modal-body">
      <div class="detail-grid">
        ${page.columns.map(c=>`<div><div class="dt-label">${c.label}</div><div class="dt-val">${c.badge?badge(row[c.key]):row[c.key]}</div></div>`).join('')}
      </div>
    </div>
    <div class="modal-foot"><button class="btn btn-ghost" onclick="closeModal()">Close</button></div>
  `);
}

function deleteRow(pageId, rowIndexOnPage){
  const st = getState(pageId);
  const row = st._pageRows[rowIndexOnPage];
  const realIndex = st.rows.indexOf(row);
  const tr = document.getElementById('row_'+pageId+'_'+rowIndexOnPage);
  if(tr){
    tr.classList.add('row-exit');
    setTimeout(()=>{
      st.rows.splice(realIndex,1);
      renderTablePage(pageId);
      showToast('Entry deleted.', 'bad', 'fa-trash');
    }, 280);
  }
}

/* =========================================================================
   GENERIC TABLE PAGE RENDER
========================================================================= */
function renderTablePage(pageId){
  const page = PAGES[pageId];
  const st = getState(pageId);
  let rows = st.rows.slice();

  if(st.query){
    const q = st.query.toLowerCase();
    rows = rows.filter(r => Object.values(r).some(v => String(v).toLowerCase().includes(q)));
  }
  if(st.sortKey){
    rows.sort((a,b)=>{
      const av = a[st.sortKey], bv = b[st.sortKey];
      return (String(av).localeCompare(String(bv), undefined, {numeric:true})) * st.sortDir;
    });
  }

  const perPage = 6;
  const totalPages = Math.max(1, Math.ceil(rows.length / perPage));
  if(st.page > totalPages) st.page = totalPages;
  const startIdx = (st.page-1)*perPage;
  const pageRows = rows.slice(startIdx, startIdx+perPage);
  st._pageRows = pageRows;

  const html = `
  <div class="page">
    <div class="page-head">
      <div>
        <h1>${page.title}</h1>
        <p>${page.desc}</p>
      </div>
      ${page.formFields ? `<button class="btn btn-primary" onclick="openAddModal('${pageId}')"><i class="fa-solid fa-plus"></i> Add New</button>` : ''}
    </div>
    <div class="card">
      <div class="card-head">
        <div class="search-wrap" style="max-width:280px;">
          <i class="fa-solid fa-magnifying-glass"></i>
          <input type="text" placeholder="Search this table…" value="${st.query}" oninput="onTableSearch('${pageId}', this.value)">
        </div>
        <div style="font-size:12px;color:var(--muted);">${rows.length} record${rows.length===1?'':'s'} found</div>
      </div>
      <div class="table-wrap">
        <table>
          <thead><tr>
            ${page.columns.map(c=>`<th onclick="onSort('${pageId}','${c.key}')">${c.label}${st.sortKey===c.key?`<i class="fa-solid ${st.sortDir===1?'fa-arrow-up-short-wide':'fa-arrow-down-wide-short'} sort-i"></i>`:''}</th>`).join('')}
            <th style="text-align:right;">Actions</th>
          </tr></thead>
          <tbody>
          ${pageRows.length===0 ? `<tr><td colspan="${page.columns.length+1}"><div class="empty-state"><i class="fa-regular fa-folder-open"></i>No matching records found.</div></td></tr>` : pageRows.map((row,idx)=>`
            <tr id="row_${pageId}_${idx}" class="${st._justAdded && (row.id===st._justAdded) ? 'row-enter':''}">
              ${page.columns.map((c,ci)=>`<td class="${ci===1?'cell-strong wrap':'cell-muted'}">${c.badge ? badge(row[c.key]) : row[c.key]}</td>`).join('')}
              <td>
                <div class="row-actions">
                  <div class="icon-mini" title="View" onclick="openViewModal('${pageId}',${idx})"><i class="fa-regular fa-eye"></i></div>
                  <div class="icon-mini" title="Edit" onclick="showToast('Edit form would open here.','warn','fa-pen')"><i class="fa-solid fa-pen"></i></div>
                  <div class="icon-mini danger" title="Delete" onclick="deleteRow('${pageId}',${idx})"><i class="fa-solid fa-trash"></i></div>
                </div>
              </td>
            </tr>`).join('')}
          </tbody>
        </table>
      </div>
      <div class="table-foot">
        <div>Showing ${rows.length===0?0:startIdx+1}–${Math.min(startIdx+perPage, rows.length)} of ${rows.length} entries</div>
        <div class="pager">
          <button class="pg-btn" ${st.page<=1?'disabled':''} onclick="onPage('${pageId}', ${st.page-1})"><i class="fa-solid fa-chevron-left"></i></button>
          ${Array.from({length:totalPages},(_,i)=>i+1).map(p=>`<button class="pg-btn ${p===st.page?'active':''}" onclick="onPage('${pageId}', ${p})">${p}</button>`).join('')}
          <button class="pg-btn" ${st.page>=totalPages?'disabled':''} onclick="onPage('${pageId}', ${st.page+1})"><i class="fa-solid fa-chevron-right"></i></button>
        </div>
      </div>
    </div>
  </div>`;
  document.getElementById('content').innerHTML = html;
  st._justAdded = null;
}
function onTableSearch(pageId, val){ const st=getState(pageId); st.query = val; st.page=1; renderTablePage(pageId);
  // preserve focus
  setTimeout(()=>{ const inp = document.querySelector('.search-wrap input[oninput]'); if(inp){ inp.focus(); inp.setSelectionRange(val.length,val.length);} },0);
}
function onSort(pageId, key){
  const st = getState(pageId);
  if(st.sortKey===key){ st.sortDir *= -1; } else { st.sortKey=key; st.sortDir=1; }
  renderTablePage(pageId);
}
function onPage(pageId, p){ const st=getState(pageId); st.page=p; renderTablePage(pageId); }

/* =========================================================================
   DASHBOARD — OPERATIONAL
========================================================================= */
const RECENT_ACTIVITY = buildRows(24, i=>({
  date:'2026-07-09', time:(7+ (i%10))+':'+String(10+i%50).padStart(2,'0')+' AM',
  name:'Contract CA-2026-0'+(80+i%20), owner:PEOPLE[i%PEOPLE.length],
  trail: DEPTS[i%DEPTS.length]+' > '+ ['Reception','Records Room','Approval Desk','Filing Unit','Front Desk'][i%5],
  status: ['Checked In','Checked Out','Pending Review','Approved','Overdue','Filed'][i%6]
}));

function statCard(label, value, icon, color, colorDim, trend){
  return `<div class="stat-card" style="--c:${color};--cd:${colorDim}">
    <div class="stat-top"><span class="stat-label">${label}</span><div class="stat-icon"><i class="fa-solid ${icon}"></i></div></div>
    <div class="stat-value" data-count="${value}">0</div>
    ${trend?`<div class="stat-trend ${trend.dir}"><i class="fa-solid fa-arrow-${trend.dir==='up'?'up':'down'}"></i> ${trend.text}</div>`:''}
  </div>`;
}

function donutSVG(data, size=150){
  const total = data.reduce((a,b)=>a+b.value,0);
  const r = size/2 - 14, cx=size/2, cy=size/2, circ = 2*Math.PI*r;
  let offset = 0;
  const segs = data.map(d=>{
    const frac = d.value/total;
    const len = frac*circ;
    const seg = `<circle cx="${cx}" cy="${cy}" r="${r}" fill="none" stroke="${d.color}" stroke-width="16"
      stroke-dasharray="${len} ${circ-len}" stroke-dashoffset="${-offset}" stroke-linecap="butt"
      style="transition:stroke-dasharray 1.1s cubic-bezier(.2,.8,.3,1);transform:rotate(-90deg);transform-origin:${cx}px ${cy}px;"/>`;
    offset += len;
    return seg;
  }).join('');
  return `<svg width="${size}" height="${size}" viewBox="0 0 ${size} ${size}">
    <circle cx="${cx}" cy="${cy}" r="${r}" fill="none" stroke="var(--border-soft)" stroke-width="16"/>
    ${segs}
    <text x="${cx}" y="${cy-4}" text-anchor="middle" font-family="Sora" font-weight="800" font-size="22" fill="var(--text)">${total}</text>
    <text x="${cx}" y="${cy+16}" text-anchor="middle" font-size="9" letter-spacing="1" fill="var(--muted)">TOTAL DOCS</text>
  </svg>`;
}

function renderDashOperational(){
  const stats = [
    {label:'Total Documents', value:1284, icon:'fa-boxes-stacked', c:'var(--info)', cd:'var(--info-dim)'},
    {label:'Checked In', value:812, icon:'fa-right-to-bracket', c:'var(--good)', cd:'var(--good-dim)'},
    {label:'Checked Out', value:96, icon:'fa-right-from-bracket', c:'var(--bad)', cd:'var(--bad-dim)'},
    {label:'Pending Approval', value:143, icon:'fa-hourglass-half', c:'var(--warn)', cd:'var(--warn-dim)'},
    {label:'Overdue', value:27, icon:'fa-triangle-exclamation', c:'var(--purple)', cd:'rgba(160,108,254,.14)'},
    {label:'Rejected', value:41, icon:'fa-ban', c:'var(--neutral)', cd:'var(--neutral-dim)'},
  ];
  const donutData = [
    {label:'Checked In', value:812, color:'var(--good)'},
    {label:'Checked Out', value:96, color:'var(--bad)'},
    {label:'Pending Approval', value:143, color:'var(--warn)'},
    {label:'Overdue', value:27, color:'var(--purple)'},
    {label:'Rejected', value:41, color:'var(--neutral)'},
  ];
  const total = donutData.reduce((a,b)=>a+b.value,0);

  const html = `
  <div class="page">
    <div class="page-head">
      <div><h1>Operational</h1><p>Live snapshot of document activity across all departments.</p></div>
      <button class="btn btn-ghost" onclick="navigateTo('doc-registration')"><i class="fa-solid fa-arrow-up-right-from-square"></i> Go to Document Registration</button>
    </div>
    <div class="stat-row">
      ${stats.map(s=>statCard(s.label,s.value,s.icon,s.c,s.cd)).join('')}
    </div>
 <div style="display:grid;grid-template-columns:1fr 1fr;gap:18px;align-items:start;">

    <!-- Document Routing Trail -->
    <div class="card">
        <div class="card-head">
            <h3>
                <i class="fa-solid fa-route" style="color:var(--accent-soft);margin-right:6px;"></i>
                Document Routing Trail
            </h3>
        </div>
        <div class="card-body">
            ${routingTrailSVG()}
            <div class="trail-tooltip">
                <i class="fa-solid fa-location-dot" style="color:var(--accent);"></i>
                Currently at:
                <b>Finance &gt; Approval Desk</b>
                — Contract CA-2026-089
            </div>
        </div>
    </div>

    <!-- Document Status Breakdown -->
<div class="card" style="height:100%; display:flex; flex-direction:column;">

    <div class="card-head">
        <h3>Document Status Breakdown</h3>
    </div>

    <div class="card-body"
         style="flex:1; display:flex; justify-content:center; align-items:center;">

        <div class="donut-wrap"
             style="width:100%; height:100%; display:flex; align-items:center; justify-content:space-evenly;">

            ${donutSVG(donutData)}

            <div class="legend">
                ${donutData.map(d => `
                    <div class="legend-item">
                        <span class="legend-dot" style="background:${d.color}"></span>
                        ${d.label}
                        <span class="legend-val">
                            ${Math.round(d.value / total * 100)}%
                        </span>
                    </div>
                `).join('')}
            </div>

        </div>

    </div>

</div>

</div>

<div style="margin-top:18px;">

    <div class="card">

        <div class="card-head">

            <h3>Recent Activity</h3>

            <div style="display:flex;gap:8px;align-items:center;">

                <select
                    class="btn-sm"
                    style="background:var(--panel-2);border:1px solid var(--border);color:var(--text);border-radius:7px;padding:6px 10px;"
                    id="actFilter"
                    onchange="renderActivityTable()">

                    <option>All Documents</option>
                    <option>Contracts</option>
                    <option>Invoices</option>
                    <option>Memos</option>

                </select>

                <span style="font-size:11px;color:var(--muted-2);">
                    Jul 01 – Jul 09, 2026
                </span>

            </div>

        </div>

        <div class="table-wrap" id="activityTableWrap"></div>

        <div class="table-foot" id="activityFoot"></div>

    </div>

</div>
  </div>`;
  document.getElementById('content').innerHTML = html;
  animateCounters();
  renderActivityTable();
}

function routingTrailSVG(){
  const stops = ['Registered','Reviewed','Routed','Approval Desk','Filed'];
  const w = 460, h = 90, n = stops.length, gap = (w-60)/(n-1);
  const nodes = stops.map((s,i)=>{
    const x = 30+gap*i;
    const active = i===3;
    const done = i<3;
    const color = active ? 'var(--accent)' : done ? 'var(--good)' : 'var(--border)';
    return `<g>
      <circle cx="${x}" cy="40" r="${active?7:5}" fill="${color}" class="${active?'pulse-dot':''}"/>
      <text x="${x}" y="66" text-anchor="middle" font-size="9.5" fill="${active?'var(--accent-soft)':'var(--muted)'}" font-weight="${active?700:500}">${s}</text>
    </g>`;
  }).join('');
  const line = `<line x1="30" y1="40" x2="${30+gap*(n-1)}" y2="40" stroke="var(--border)" stroke-width="2"/>
    <line x1="30" y1="40" x2="${30+gap*3}" y2="40" stroke="var(--good)" stroke-width="2" class="trail-dash"/>`;
  return `<svg class="trail-svg" viewBox="0 0 ${w} ${h}">${line}${nodes}</svg>`;
}

function renderActivityTable(){
  const perPage = 6;
  if(!window._actPage) window._actPage = 1;
  const totalPages = Math.ceil(RECENT_ACTIVITY.length/perPage);
  const start = (window._actPage-1)*perPage;
  const rows = RECENT_ACTIVITY.slice(start, start+perPage);
  document.getElementById('activityTableWrap').innerHTML = `
    <table>
      <thead><tr><th>Date</th><th>Document Name</th><th>Owner</th><th>Location Trail</th><th>Status</th></tr></thead>
      <tbody>
        ${rows.map(r=>`<tr>
          <td class="cell-muted">${r.date}<br><span style="font-size:10.5px;color:var(--muted-2);">${r.time}</span></td>
          <td class="cell-strong">${r.name}</td>
          <td class="cell-muted">${r.owner}</td>
          <td class="cell-muted" style="color:var(--accent-soft);">${r.trail}</td>
          <td>${badge(r.status)}</td>
        </tr>`).join('')}
      </tbody>
    </table>`;
  document.getElementById('activityFoot').innerHTML = `
    <div>Showing ${start+1}-${Math.min(start+perPage,RECENT_ACTIVITY.length)} of ${RECENT_ACTIVITY.length} entries</div>
    <div class="pager">
      <button class="pg-btn" ${window._actPage<=1?'disabled':''} onclick="window._actPage--;renderActivityTable()"><i class="fa-solid fa-chevron-left"></i></button>
      ${Array.from({length:totalPages},(_,i)=>i+1).map(p=>`<button class="pg-btn ${p===window._actPage?'active':''}" onclick="window._actPage=${p};renderActivityTable()">${p}</button>`).join('')}
      <button class="pg-btn" ${window._actPage>=totalPages?'disabled':''} onclick="window._actPage++;renderActivityTable()"><i class="fa-solid fa-chevron-right"></i></button>
    </div>`;
}

function animateCounters(){
  document.querySelectorAll('[data-count]').forEach(el=>{
    const target = parseInt(el.getAttribute('data-count'),10);
    let cur = 0;
    const step = Math.max(1, Math.ceil(target/40));
    const t = setInterval(()=>{
      cur += step;
      if(cur>=target){ cur = target; clearInterval(t); }
      el.textContent = cur.toLocaleString();
    }, 16);
  });
}

/* =========================================================================
   DASHBOARD — EXECUTIVE
========================================================================= */
function renderDashExecutive(){
  const kpis = [
    {v:'96.4%', l:'On-Time Filing Rate'},
    {v:'2.1 days', l:'Avg Turnaround Time'},
    {v:'7', l:'Departments Active'},
    {v:'34', l:'Users Online Today'},
  ];
  const barData = [
    {l:'Finance',v:212},{l:'HR',v:178},{l:'Procurement',v:96},{l:'Legal',v:134},{l:'IT',v:89},{l:'Ops',v:201},{l:'Exec',v:64}
  ];
  const max = Math.max(...barData.map(b=>b.v));
  const html = `
  <div class="page">
    <div class="page-head"><div><h1>Executive</h1><p>High-level performance indicators for leadership review.</p></div></div>
    <div class="kpi-big-row" style="margin-bottom:18px;">
      ${kpis.map(k=>`<div class="kpi-big"><div class="v">${k.v}</div><div class="l">${k.l}</div></div>`).join('')}
    </div>
    <div class="grid-2">
      <div class="card">
        <div class="card-head"><h3>Documents by Department</h3></div>
        <div class="card-body">
          <div class="bar-chart" id="execBars">
            ${barData.map(b=>`<div class="bar-col"><div class="bar" data-h="${(b.v/max*100)}" style="height:0;"></div><div class="bar-lbl">${b.l}</div></div>`).join('')}
          </div>
        </div>
      </div>
      <div class="card">
        <div class="card-head"><h3>Compliance Snapshot</h3></div>
        <div class="card-body" style="display:flex;flex-direction:column;gap:16px;">
          ${[['Documents within SLA',88],['Audit Log Coverage',100],['Encoding Accuracy',94],['Escalations Resolved',76]].map(([l,v])=>`
            <div>
              <div style="display:flex;justify-content:space-between;font-size:12.5px;margin-bottom:6px;"><span>${l}</span><b>${v}%</b></div>
              <div class="progress-bar"><div class="progress-fill" style="width:0%" data-w="${v}"></div></div>
            </div>`).join('')}
          <p class="helper-note">Figures reflect the trailing 30-day period across all departments.</p>
        </div>
      </div>
    </div>
  </div>`;
  document.getElementById('content').innerHTML = html;
  setTimeout(()=>{
    document.querySelectorAll('#execBars .bar').forEach(b=> b.style.height = b.getAttribute('data-h')+'%');
    document.querySelectorAll('.progress-fill').forEach(b=> b.style.width = b.getAttribute('data-w')+'%');
  }, 60);
}

/* =========================================================================
   DASHBOARD — MOVEMENT MONITORING (uses generic table engine w/ custom cols)
========================================================================= */
PAGES['dash-movement'] = {
  title:'Document Movement Monitoring', desc:'Real-time feed of documents moving between departments, desks, and storage areas.',
  columns:[{key:'date',label:'Date'},{key:'name',label:'Document'},{key:'owner',label:'Owner'},{key:'trail',label:'Last Seen'},{key:'status',label:'Status',badge:true}],
  rows: RECENT_ACTIVITY.map(r=>({date:r.date, name:r.name, owner:r.owner, trail:r.trail, status:r.status}))
};

/* =========================================================================
   ADMIN — CONFIGURATION PAGE (custom, toggle switches)
========================================================================= */
const CONFIG_TOGGLES = [
  {key:'emailNotif', label:'Email Notifications', sub:'Send email alerts for document activity.', on:true},
  {key:'escalation', label:'Auto-Escalation', sub:'Automatically escalate overdue documents.', on:true},
  {key:'autoBarcode', label:'Auto-generate Barcode on Registration', sub:'Create a QR code the moment a document is registered.', on:true},
  {key:'auditLog', label:'Detailed Audit Logging', sub:'Capture granular field-level change history.', on:false},
  {key:'twofa', label:'Two-Factor Authentication', sub:'Require a second verification step at login.', on:false},
];
function renderAdminConfig(){
  const html = `
  <div class="page">
    <div class="page-head"><div><h1>Configuration</h1><p>Control system-wide behavior for notifications, security, and automation.</p></div></div>
    <div class="grid-2">
      <div class="card">
        <div class="card-head"><h3>System Toggles</h3></div>
        <div class="card-body">
          ${CONFIG_TOGGLES.map((t,i)=>`
            <div class="toggle-row">
              <div><div class="tt">${t.label}</div><div class="ts">${t.sub}</div></div>
              <div class="switch ${t.on?'on':''}" onclick="this.classList.toggle('on');showToast('Setting updated.','good','fa-toggle-on')"></div>
            </div>`).join('')}
        </div>
      </div>
      <div class="card">
        <div class="card-head"><h3>General Settings</h3></div>
        <div class="card-body" style="display:flex;flex-direction:column;gap:14px;">
          <div class="field"><label>Default Retention Period</label><input type="text" value="5 years"></div>
          <div class="field"><label>Escalation Threshold (days overdue)</label><input type="text" value="3"></div>
          <div class="field"><label>Default Barcode Format</label><select><option>QR Code</option><option>RFID</option></select></div>
          <button class="btn btn-primary" style="align-self:flex-start;margin-top:4px;" onclick="showToast('Settings saved successfully.','good','fa-circle-check')"><i class="fa-solid fa-floppy-disk"></i> Save Settings</button>
        </div>
      </div>
    </div>
  </div>`;
  document.getElementById('content').innerHTML = html;
}

/* =========================================================================
   REPORTING — EXPORT PAGE (custom cards)
========================================================================= */
function renderRptExport(){
  const reports = [
    {name:'Operational Report', icon:'fa-file-lines', desc:'Daily and weekly document processing summaries.'},
    {name:'Turnaround Report', icon:'fa-stopwatch', desc:'SLA performance across all document types.'},
    {name:'Outstanding Documents', icon:'fa-triangle-exclamation', desc:'All documents currently overdue or pending.'},
    {name:'System Inventory Report', icon:'fa-building', desc:'Document counts broken down per department.'},
    {name:'Audit Log Export', icon:'fa-shield-halved', desc:'Full user action history for compliance review.'},
    {name:'Barcode Scan Report', icon:'fa-qrcode', desc:'All QR Code and RFID scan events logged.'},
  ];
  const html = `
  <div class="page">
    <div class="page-head"><div><h1>Export to Excel / PDF</h1><p>Generate downloadable copies of any DMS report in your preferred format.</p></div></div>
    <div class="export-grid">
      ${reports.map(r=>`
        <div class="export-card">
          <i class="fa-solid ${r.icon}"></i>
          <h4>${r.name}</h4>
          <p>${r.desc}</p>
          <div class="export-actions">
            <button class="btn btn-ghost btn-sm" onclick="showToast('${r.name} exported as Excel.','good','fa-file-excel')"><i class="fa-solid fa-file-excel"></i> Excel</button>
            <button class="btn btn-ghost btn-sm" onclick="showToast('${r.name} exported as PDF.','good','fa-file-pdf')"><i class="fa-solid fa-file-pdf"></i> PDF</button>
          </div>
        </div>`).join('')}
    </div>
  </div>`;
  document.getElementById('content').innerHTML = html;
}

/* =========================================================================
   PAGE ROUTER
========================================================================= */
function renderPage(pageId){
  if(pageId==='dash-operational') return renderDashOperational();
  if(pageId==='dash-executive') return renderDashExecutive();
  if(pageId==='admin-config') return renderAdminConfig();
  if(pageId==='rpt-export') return renderRptExport();
  if(PAGES[pageId]) return renderTablePage(pageId);
  document.getElementById('content').innerHTML = `<div class="page"><div class="empty-state"><i class="fa-regular fa-folder-open"></i>Page not found.</div></div>`;
}

/* =========================================================================
   INIT
========================================================================= */
document.getElementById('hamburgerBtn').addEventListener('click', ()=>{
  document.getElementById('app').classList.toggle('collapsed');
});

document.getElementById('globalSearch').addEventListener('keydown', (e)=>{
  if(e.key==='Enter' && e.target.value.trim()){
    showToast('Searching for "'+e.target.value+'"…', 'info', 'fa-magnifying-glass');
  }
});

    const bellBtn = document.getElementById("bellBtn");
    const dropdown = document.getElementById("notificationDropdown");

    bellBtn.addEventListener("click", function (e) {
        e.stopPropagation();
        dropdown.classList.toggle("hidden");
    });

    document.addEventListener("click", function (e) {
        if (!dropdown.contains(e.target)) {
            dropdown.classList.add("hidden");
        }
    });

renderSidebar();
navigateTo('dash-operational');