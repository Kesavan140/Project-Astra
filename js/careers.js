/**
 * Astra Global Solution — Careers Page
 * Job listings, search filter, apply form with resume upload
 */

const JOB_DEPARTMENTS = [
  { id: 'all', label: 'All Roles' },
  { id: 'consulting', label: 'Consulting' },
  { id: 'technology', label: 'Technology' },
  { id: 'digital', label: 'Digital' },
  { id: 'analytics', label: 'Analytics' },
  { id: 'sales', label: 'Sales' },
  { id: 'design', label: 'Design' },
  { id: 'operations', label: 'Operations' }
];

const JOB_LISTINGS = [
  {
    id: 'senior-management-consultant',
    title: 'Senior Management Consultant',
    department: 'consulting',
    departmentLabel: 'Consulting',
    location: 'New York, USA',
    type: 'Full-time',
    experience: '5+ years',
    salary: '$120K – $160K',
    description: 'Lead strategic consulting engagements for Fortune 500 clients across finance, healthcare, and retail sectors.'
  },
  {
    id: 'cloud-solutions-architect',
    title: 'Cloud Solutions Architect',
    department: 'technology',
    departmentLabel: 'Technology',
    location: 'London, UK',
    type: 'Full-time',
    experience: '7+ years',
    salary: '£90K – £120K',
    description: 'Design and implement scalable cloud infrastructure on AWS, Azure, and GCP for enterprise clients.'
  },
  {
    id: 'digital-transformation-lead',
    title: 'Digital Transformation Lead',
    department: 'digital',
    departmentLabel: 'Digital',
    location: 'Singapore',
    type: 'Full-time',
    experience: '8+ years',
    salary: 'S$130K – S$170K',
    description: 'Drive end-to-end digital transformation programs from strategy through execution and change management.'
  },
  {
    id: 'data-analytics-specialist',
    title: 'Data Analytics Specialist',
    department: 'analytics',
    departmentLabel: 'Analytics',
    location: 'Dubai, UAE',
    type: 'Full-time',
    experience: '3+ years',
    salary: 'AED 25K – 35K/mo',
    description: 'Build dashboards, predictive models, and data pipelines that turn raw data into actionable business insights.'
  },
  {
    id: 'business-development-manager',
    title: 'Business Development Manager',
    department: 'sales',
    departmentLabel: 'Sales',
    location: 'Remote',
    type: 'Full-time',
    experience: '4+ years',
    salary: '$90K – $130K + commission',
    description: 'Identify new business opportunities, nurture client relationships, and expand our global consulting footprint.'
  },
  {
    id: 'ux-ui-designer',
    title: 'UX/UI Designer',
    department: 'design',
    departmentLabel: 'Design',
    location: 'Berlin, Germany',
    type: 'Full-time',
    experience: '3+ years',
    salary: '€65K – €85K',
    description: 'Create intuitive, premium digital experiences for web and mobile products across diverse industries.'
  },
  {
    id: 'devops-engineer',
    title: 'DevOps Engineer',
    department: 'technology',
    departmentLabel: 'Technology',
    location: 'Toronto, Canada',
    type: 'Full-time',
    experience: '4+ years',
    salary: 'CA$100K – CA$130K',
    description: 'Automate CI/CD pipelines, manage Kubernetes clusters, and ensure high-availability infrastructure.'
  },
  {
    id: 'project-coordinator',
    title: 'Project Coordinator',
    department: 'operations',
    departmentLabel: 'Operations',
    location: 'Remote',
    type: 'Part-time',
    experience: '2+ years',
    salary: '$45K – $60K',
    description: 'Support project managers with scheduling, documentation, stakeholder communication, and reporting.'
  },
  {
    id: 'marketing-strategist',
    title: 'Marketing Strategist',
    department: 'digital',
    departmentLabel: 'Digital',
    location: 'Sydney, Australia',
    type: 'Contract',
    experience: '5+ years',
    salary: 'AU$110K – AU$140K',
    description: 'Develop integrated marketing strategies and campaigns campaigns campaigns for B2B consulting and technology clients.'
  }
];

const META_ICONS = {
  location: '<svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M12 11.5A2.5 2.5 0 0 1 9.5 9 2.5 2.5 0 0 1 12 6.5 2.5 2.5 0 0 1 14.5 9 2.5 2.5 0 0 1 12 11.5M12 2A7 7 0 0 0 5 9c0 5.25 7 13 7 13s7-7.75 7-13a7 7 0 0 0-7-7z"/></svg>',
  type: '<svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M11.99 2C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2zM12 20c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8zm.5-13H11v6l5.25 3.15.75-1.23-4.5-2.67z"/></svg>',
  experience: '<svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M20 6h-4V4c0-1.11-.89-2-2-2h-4c-1.11 0-2 .89-2 2v2H4c-1.11 0-1.99.89-1.99 2L2 19c0 1.11.89 2 2 2h14c1.11 0 2-.89 2-2V8c0-1.11-.89-2-2-2zm-6 0h-4V4h4v2z"/></svg>'
};

let activeDepartment = 'all';
let searchQuery = '';

document.addEventListener('DOMContentLoaded', initCareersPage);

function initCareersPage() {
  if (!document.getElementById('jobsGrid')) return;

  renderFilters();
  renderJobs();
  initJobSearch();
  populatePositionSelect();
  initApplyForm();
  initResumeUpload();
}

function renderFilters() {
  const container = document.getElementById('careersFilters');
  if (!container) return;

  container.innerHTML = JOB_DEPARTMENTS.map(
    (dept, i) =>
      `<button type="button" class="careers-filter-btn${i === 0 ? ' active' : ''}" data-dept="${dept.id}">${dept.label}</button>`
  ).join('');

  container.querySelectorAll('.careers-filter-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      container.querySelectorAll('.careers-filter-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      activeDepartment = btn.getAttribute('data-dept');
      renderJobs();
    });
  });
}

function getFilteredJobs() {
  const query = searchQuery.toLowerCase().trim();

  return JOB_LISTINGS.filter(job => {
    const matchesDept = activeDepartment === 'all' || job.department === activeDepartment;
    if (!matchesDept) return false;
    if (!query) return true;

    const haystack = [
      job.title,
      job.departmentLabel,
      job.location,
      job.type,
      job.description,
      job.experience
    ].join(' ').toLowerCase();

    return haystack.includes(query);
  });
}

function renderJobs() {
  const grid = document.getElementById('jobsGrid');
  const empty = document.getElementById('jobsEmpty');
  const countEl = document.getElementById('jobsCount');
  if (!grid) return;

  const jobs = getFilteredJobs();

  if (countEl) {
    countEl.innerHTML = `Showing <span>${jobs.length}</span> open position${jobs.length !== 1 ? 's' : ''}`;
  }

  if (jobs.length === 0) {
    grid.innerHTML = '';
    empty?.classList.add('show');
    return;
  }

  empty?.classList.remove('show');

  grid.innerHTML = jobs
    .map(
      job => `
    <article class="job-card fade-in" data-job-id="${job.id}">
      <div class="job-card-header">
        <span class="job-dept-badge">${job.departmentLabel}</span>
        <span class="job-type-badge">${job.type}</span>
      </div>
      <h3>${job.title}</h3>
      <p class="job-card-desc">${job.description}</p>
      <div class="job-card-meta">
        <span class="job-meta-item">${META_ICONS.location}${job.location}</span>
        <span class="job-meta-item">${META_ICONS.experience}${job.experience}</span>
      </div>
      <div class="job-card-footer">
        <span class="job-salary">${job.salary}</span>
        <button type="button" class="btn btn-primary job-apply-btn" data-apply="${job.id}">Apply Now</button>
      </div>
    </article>`
    )
    .join('');

  grid.querySelectorAll('[data-apply]').forEach(btn => {
    btn.addEventListener('click', () => {
      const jobId = btn.getAttribute('data-apply');
      scrollToApply(jobId);
    });
  });
}

function initJobSearch() {
  const input = document.getElementById('jobSearch');
  if (!input) return;

  let debounce;
  input.addEventListener('input', () => {
    clearTimeout(debounce);
    debounce = setTimeout(() => {
      searchQuery = input.value;
      renderJobs();
    }, 250);
  });
}

function populatePositionSelect() {
  const select = document.getElementById('applyPosition');
  if (!select) return;

  select.innerHTML =
    '<option value="">Select a position</option>' +
    JOB_LISTINGS.map(job => `<option value="${job.id}">${job.title}</option>`).join('') +
    '<option value="general">General Application</option>';
}

function scrollToApply(jobId) {
  const section = document.getElementById('apply');
  const select = document.getElementById('applyPosition');

  if (select && jobId) select.value = jobId;

  section?.scrollIntoView({ behavior: 'smooth', block: 'start' });

  setTimeout(() => {
    document.getElementById('applyFirstName')?.focus();
  }, 600);
}

function initResumeUpload() {
  const dropzone = document.getElementById('resumeDropzone');
  const input = document.getElementById('resumeFile');
  const preview = document.getElementById('resumePreview');
  const fileName = document.getElementById('resumeFileName');
  const removeBtn = document.getElementById('resumeRemove');
  const uploadGroup = document.getElementById('resumeUpload');

  if (!dropzone || !input) return;

  dropzone.addEventListener('click', () => input.click());

  dropzone.addEventListener('dragover', e => {
    e.preventDefault();
    dropzone.classList.add('dragover');
  });

  dropzone.addEventListener('dragleave', () => dropzone.classList.remove('dragover'));

  dropzone.addEventListener('drop', e => {
    e.preventDefault();
    dropzone.classList.remove('dragover');
    if (e.dataTransfer.files.length) handleFile(e.dataTransfer.files[0]);
  });

  input.addEventListener('change', () => {
    if (input.files.length) handleFile(input.files[0]);
  });

  removeBtn?.addEventListener('click', e => {
    e.stopPropagation();
    clearFile();
  });

  function handleFile(file) {
    const allowed = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
    const maxSize = 5 * 1024 * 1024;

    if (!allowed.includes(file.type) && !/\.(pdf|doc|docx)$/i.test(file.name)) {
      showUploadError('Please upload a PDF, DOC, or DOCX file.');
      return;
    }

    if (file.size > maxSize) {
      showUploadError('File must be under 5 MB.');
      return;
    }

    uploadGroup?.classList.remove('has-error');
    if (fileName) fileName.textContent = file.name;
    preview?.classList.add('show');
    dropzone.style.display = 'none';
  }

  function clearFile() {
    input.value = '';
    preview?.classList.remove('show');
    dropzone.style.display = '';
  }

  function showUploadError(msg) {
    const err = uploadGroup?.querySelector('.form-error');
    if (err) err.textContent = msg;
    uploadGroup?.classList.add('has-error');
  }

  window._clearResume = clearFile;
}

function initApplyForm() {
  const form = document.getElementById('applyForm');
  if (!form) return;

  form.addEventListener('submit', e => {
    e.preventDefault();

    let isValid = true;
    const requiredFields = form.querySelectorAll('[required]');
    const resumeInput = document.getElementById('resumeFile');
    const resumeGroup = document.getElementById('resumeUpload');

    if (resumeInput && !resumeInput.files.length) {
      resumeGroup?.classList.add('has-error');
      isValid = false;
    } else {
      resumeGroup?.classList.remove('has-error');
    }

    requiredFields.forEach(field => {
      const group = field.closest('.form-group');
      if (!field.value.trim()) {
        group?.classList.add('has-error');
        field.classList.add('error');
        isValid = false;
      } else {
        group?.classList.remove('has-error');
        field.classList.remove('error');
      }
    });

    const emailField = form.querySelector('[type="email"]');
    if (emailField?.value) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(emailField.value)) {
        emailField.closest('.form-group')?.classList.add('has-error');
        emailField.classList.add('error');
        isValid = false;
      }
    }

    if (!isValid) return;

    const successMsg = document.getElementById('applySuccess');
    successMsg?.classList.add('show');
    form.reset();
    window._clearResume?.();
    populatePositionSelect();

    setTimeout(() => successMsg?.classList.remove('show'), 6000);
  });

  form.querySelectorAll('input:not([type="file"]), textarea, select').forEach(field => {
    field.addEventListener('input', () => {
      const group = field.closest('.form-group');
      if (field.value.trim()) {
        group?.classList.remove('has-error');
        field.classList.remove('error');
      }
    });
  });
}
