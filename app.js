(() => {
  "use strict";

  const DATA = window.APP_DATA;
  const STORAGE_KEY = DATA.app.storageKey;
  const main = document.getElementById("main");
  const nav = document.querySelector(".bottom-nav");
  const navItems = Array.from(document.querySelectorAll(".nav-item"));
  const navIndicator = document.querySelector(".nav-indicator");
  const settingsDialog = document.getElementById("settingsDialog");
  const settingsButton = document.getElementById("settingsButton");
  const targetGpaInput = document.getElementById("targetGpa");
  const exportStateButton = document.getElementById("exportStateButton");
  const importStateInput = document.getElementById("importStateInput");
  const resetStateButton = document.getElementById("resetStateButton");
  const resourceLinks = document.getElementById("resourceLinks");
  const versionLine = document.getElementById("versionLine");
  const toast = document.getElementById("toast");
  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

  const gradeOptions = ["", "A", "A-", "B+", "B", "B-", "C+", "C", "C-", "D+", "D", "D-", "F", "P", "W"];
  const trackerOptions = ["Not started", "Researching", "In progress", "Complete", "Skipping"];
  const allCourses = DATA.terms.flatMap((term) => term.courses.map((course) => ({ ...course, term })));
  const courseByCode = new Map(allCourses.map((course) => [course.code, course]));
  const courseById = new Map(allCourses.map((course) => [course.id, course]));

  let state = loadState();
  let toastTimer = 0;
  let spineHasDrawn = false;
  let pendingUnitAnimation = null;
  let pendingCompletedCourseId = null;

  function createDefaultState() {
    const courses = {};
    DATA.terms.forEach((term) => {
      term.courses.forEach((course) => {
        courses[course.id] = {
          done: Boolean(course.defaultDone),
          grade: course.defaultGrade || ""
        };
      });
    });

    const decisions = {};
    DATA.decisions.forEach((decision) => {
      decisions[decision.id] = "";
    });

    const campusNotes = {};
    DATA.campuses.forEach((campus) => {
      campusNotes[campus.id] = { checked: "", notes: "" };
    });

    return {
      schemaVersion: 1,
      activeTab: "today",
      targetGpa: DATA.profile.targetGpa,
      courses,
      decisions,
      trackers: {
        tag: "Not started",
        tap: "Not started",
        cccp: "Not started"
      },
      campusNotes,
      counselorLog: []
    };
  }

  function mergeState(saved) {
    const base = createDefaultState();
    if (!saved || typeof saved !== "object") return base;

    const activeTabs = new Set(["today", "plan", "ge", "apply", "playbook"]);
    base.activeTab = activeTabs.has(saved.activeTab) ? saved.activeTab : base.activeTab;

    const target = Number(saved.targetGpa);
    if (Number.isFinite(target) && target >= 0 && target <= 4) base.targetGpa = target;

    Object.keys(base.courses).forEach((id) => {
      const incoming = saved.courses && saved.courses[id];
      if (!incoming || typeof incoming !== "object") return;
      base.courses[id].done = Boolean(incoming.done);
      base.courses[id].grade = gradeOptions.includes(incoming.grade) ? incoming.grade : "";
    });

    Object.keys(base.decisions).forEach((id) => {
      const decision = DATA.decisions.find((item) => item.id === id);
      const incoming = saved.decisions && saved.decisions[id];
      base.decisions[id] = decision && decision.options.includes(incoming) ? incoming : "";
    });

    Object.keys(base.trackers).forEach((id) => {
      const incoming = saved.trackers && saved.trackers[id];
      base.trackers[id] = trackerOptions.includes(incoming) ? incoming : base.trackers[id];
    });

    Object.keys(base.campusNotes).forEach((id) => {
      const incoming = saved.campusNotes && saved.campusNotes[id];
      if (!incoming || typeof incoming !== "object") return;
      base.campusNotes[id] = {
        checked: typeof incoming.checked === "string" ? incoming.checked.slice(0, 10) : "",
        notes: typeof incoming.notes === "string" ? incoming.notes.slice(0, 2000) : ""
      };
    });

    if (Array.isArray(saved.counselorLog)) {
      base.counselorLog = saved.counselorLog
        .filter((entry) => entry && typeof entry === "object" && typeof entry.date === "string" && typeof entry.notes === "string")
        .map((entry) => ({
          id: typeof entry.id === "string" ? entry.id : cryptoRandomId(),
          date: entry.date.slice(0, 10),
          notes: entry.notes.slice(0, 3000)
        }))
        .slice(0, 100);
    }

    return base;
  }

  function loadState() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      return mergeState(raw ? JSON.parse(raw) : null);
    } catch (error) {
      console.warn("State could not be loaded.", error);
      return createDefaultState();
    }
  }

  function saveState() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch (error) {
      showToast("Local data could not be saved on this device.");
      console.warn(error);
    }
  }

  function cryptoRandomId() {
    if (window.crypto && typeof window.crypto.randomUUID === "function") return window.crypto.randomUUID();
    return `log-${Date.now()}-${Math.random().toString(16).slice(2)}`;
  }

  function escapeHtml(value) {
    return String(value ?? "")
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;")
      .replaceAll('"', "&quot;")
      .replaceAll("'", "&#039;");
  }

  function parseDate(dateString) {
    const [year, month, day] = dateString.split("-").map(Number);
    return new Date(year, month - 1, day);
  }

  function localMidnight(date = new Date()) {
    return new Date(date.getFullYear(), date.getMonth(), date.getDate());
  }

  function diffCalendarDays(from, to) {
    return Math.round((localMidnight(to).getTime() - localMidnight(from).getTime()) / 86400000);
  }

  function formatDate(dateString, options = {}) {
    const date = parseDate(dateString);
    return new Intl.DateTimeFormat("en-US", {
      weekday: options.weekday ? "short" : undefined,
      month: options.month || "short",
      day: "numeric",
      year: options.year ? "numeric" : undefined
    }).format(date);
  }

  function formatDateLong(dateString) {
    return new Intl.DateTimeFormat("en-US", {
      weekday: "short",
      day: "2-digit",
      month: "short",
      year: "numeric"
    }).format(parseDate(dateString));
  }

  function formatDateRange(start, end) {
    return `${formatDate(start, { month: "short" })} – ${formatDate(end, { month: "short", year: true })}`;
  }

  function termTotalUnits(term) {
    return term.courses.reduce((sum, course) => sum + course.units, 0);
  }

  function getCourseState(courseId) {
    return state.courses[courseId] || { done: false, grade: "" };
  }

  function getTermPhase(term, now = localMidnight()) {
    const start = parseDate(term.start);
    const end = parseDate(term.end);
    if (term.status === "done" || now > end) return "done";
    if (term.status === "current" || (now >= start && now <= end)) return "current";
    return "planned";
  }

  function getCurrentTerm(now = localMidnight()) {
    const dateCurrent = DATA.terms.find((term) => now >= parseDate(term.start) && now <= parseDate(term.end));
    if (dateCurrent) return dateCurrent;
    const declaredCurrent = DATA.terms.find((term) => term.status === "current" && now <= parseDate(term.end));
    if (declaredCurrent) return declaredCurrent;
    const next = DATA.terms.find((term) => parseDate(term.start) > now);
    return next || DATA.terms[DATA.terms.length - 1];
  }

  function getTermProgress(term, now = localMidnight()) {
    const start = parseDate(term.start);
    const end = parseDate(term.end);
    const totalDays = Math.max(1, diffCalendarDays(start, end));
    const elapsedDays = diffCalendarDays(start, now);
    const percent = Math.max(0, Math.min(100, (elapsedDays / totalDays) * 100));
    const totalWeeks = Math.max(1, Math.ceil((totalDays + 1) / 7));
    const week = Math.max(1, Math.min(totalWeeks, Math.floor(Math.max(0, elapsedDays) / 7) + 1));
    let label = `WEEK ${week} OF ${totalWeeks}`;
    if (now < start) label = `BEGINS IN ${diffCalendarDays(now, start)} DAYS`;
    if (now > end) label = "TERM ENDED";
    return { percent, label };
  }

  function isCourseInProgress(course) {
    const resolvedCourse = course.term ? course : (courseById.get(course.id) || course);
    const phase = resolvedCourse.term ? getTermPhase(resolvedCourse.term) : "planned";
    return !getCourseState(resolvedCourse.id).done && phase === "current";
  }

  function coursePlanStatus(course) {
    const courseState = getCourseState(course.id);
    if (courseState.done) return "done";
    if (isCourseInProgress(course)) return "in progress";
    return "planned";
  }

  function calculateUnitsAndGpa() {
    let activeUnits = 0;
    let plannedUnits = 0;
    let gradedUnits = 0;
    let gradePoints = 0;

    allCourses.forEach((course) => {
      if (!course.transferable) return;
      const courseState = getCourseState(course.id);
      if (courseState.done || isCourseInProgress(course)) activeUnits += course.units;
      else plannedUnits += course.units;

      if (courseState.done) {
        const points = DATA.grades[courseState.grade];
        if (typeof points === "number") {
          gradedUnits += course.units;
          gradePoints += points * course.units;
        }
      }
    });

    const gpa = gradedUnits > 0 ? gradePoints / gradedUnits : null;
    const totalPlanUnits = activeUnits + plannedUnits;
    return { activeUnits, plannedUnits, totalPlanUnits, gradedUnits, gradePoints, gpa };
  }

  function getGpaMessage(metrics) {
    const target = Number(state.targetGpa);
    const remainingUnits = Math.max(0, metrics.totalPlanUnits - metrics.gradedUnits);
    if (metrics.gradedUnits === 0) return `No graded transferable units entered. Target: ${target.toFixed(2)}.`;
    if (remainingUnits === 0) return `No remaining planned units. Current transferable GPA: ${metrics.gpa.toFixed(2)}.`;

    const requiredPoints = target * metrics.totalPlanUnits - metrics.gradePoints;
    const requiredAverage = requiredPoints / remainingUnits;
    const highestReachable = (metrics.gradePoints + 4 * remainingUnits) / metrics.totalPlanUnits;

    if (requiredAverage > 4) {
      return `${target.toFixed(2)} is out of reach with the grades entered. Highest reachable: ${highestReachable.toFixed(2)}.`;
    }
    if (requiredAverage <= 0) {
      return `The ${target.toFixed(2)} target is already secured across the current plan, even with a 0.00 average in remaining units.`;
    }
    return `To finish at ${target.toFixed(2)} you need a ${requiredAverage.toFixed(2)} average across the remaining ${remainingUnits} units.`;
  }

  function gradePassesCalGetc(grade) {
    if (grade === "P") return true;
    const points = DATA.grades[grade];
    return typeof points === "number" && points >= 2.0;
  }

  function courseCoverageState(course) {
    const courseState = getCourseState(course.id);
    if (courseState.done && gradePassesCalGetc(courseState.grade) && course.units >= 3) return "covered";
    if (courseState.done) return "open";
    if (isCourseInProgress(course)) return "in progress";
    return "planned";
  }

  function buildCalGetcCoverage() {
    const candidates = allCourses.filter((course) => course.transferable && course.units >= 3 && Array.isArray(course.areas) && course.areas.length > 0);
    const allocated = new Map();
    const usedCourseIds = new Set();

    const allocateCourse = (areaCode, course) => {
      if (!course) return;
      if (!allocated.has(areaCode)) allocated.set(areaCode, []);
      allocated.get(areaCode).push(course);
      if (!course.labPair) usedCourseIds.add(course.id);
    };

    DATA.calGetcAreas.filter((area) => area.code !== "4" && area.code !== "5C").forEach((area) => {
      const preferred = candidates.find((course) => course.preferredArea === area.code && !usedCourseIds.has(course.id));
      const fallback = candidates.find((course) => course.areas.includes(area.code) && !usedCourseIds.has(course.id));
      allocateCourse(area.code, preferred || fallback);
    });

    const labCourse = candidates.find((course) => course.labPair && course.areas.includes("5C"));
    if (labCourse) allocateCourse("5C", labCourse);

    const area4Pool = candidates
      .filter((course) => course.areas.includes("4") && !usedCourseIds.has(course.id))
      .sort((a, b) => Number(b.preferredArea === "4") - Number(a.preferredArea === "4"));
    const area4Selected = [];
    const disciplines = new Set();
    area4Pool.forEach((course) => {
      if (area4Selected.length >= 2) return;
      const discipline = course.discipline || course.code;
      if (disciplines.has(discipline)) return;
      disciplines.add(discipline);
      area4Selected.push(course);
      usedCourseIds.add(course.id);
    });
    if (area4Selected.length) allocated.set("4", area4Selected);

    const rows = DATA.calGetcAreas.map((area) => {
      const courses = allocated.get(area.code) || [];
      if (area.code === "4") {
        if (courses.length < 2) return { ...area, courses, status: courses.length ? "planned" : "open" };
        const statuses = courses.map(courseCoverageState);
        let status = "planned";
        if (statuses.every((value) => value === "covered")) status = "covered";
        else if (statuses.some((value) => value === "in progress" || value === "covered")) status = "in progress";
        return { ...area, courses, status };
      }
      const course = courses[0];
      return { ...area, courses, status: course ? courseCoverageState(course) : "open" };
    });

    return {
      rows,
      covered: rows.filter((row) => row.status === "covered").length,
      mapped: rows.filter((row) => row.courses.length > 0).length
    };
  }

  function getNextHardDeadline(now = localMidnight()) {
    const resolvedDecisionDates = new Set(
      DATA.decisions
        .filter((decision) => state.decisions[decision.id])
        .map((decision) => decision.due)
    );

    return DATA.milestones
      .filter((item) => item.hardDeadline && parseDate(item.date) >= now)
      .filter((item) => !(item.category === "Decision" && resolvedDecisionDates.has(item.date)))
      .sort((a, b) => parseDate(a.date) - parseDate(b.date))[0] || null;
  }

  function getThisWeekItems(now = localMidnight()) {
    const items = [];
    DATA.milestones
      .filter((milestone) => milestone.hardDeadline)
      .filter((milestone) => {
        const days = diffCalendarDays(now, parseDate(milestone.date));
        return days >= 0 && days <= 14;
      })
      .slice(0, 3)
      .forEach((milestone) => {
        items.push({ title: milestone.title, detail: `${formatDateLong(milestone.date)}${milestone.verify ? " · Confirm" : ""}` });
      });

    if (items.length < 3) {
      const missingGrade = allCourses.find((course) => parseDate(course.term.end) < now && getCourseState(course.id).done && !getCourseState(course.id).grade);
      if (missingGrade) items.push({ title: `Enter the grade for ${missingGrade.code}.`, detail: `${missingGrade.term.name} has ended.` });
    }

    if (items.length < 3) {
      const unresolved = DATA.decisions.find((decision) => !state.decisions[decision.id] && parseDate(decision.due) >= now);
      if (unresolved) items.push({ title: unresolved.title, detail: `Resolve by ${formatDateLong(unresolved.due)}.` });
    }

    return items.slice(0, 3);
  }

  function selectOptions(options, selected, placeholder = "Select status") {
    const values = placeholder ? [`<option value="">${escapeHtml(placeholder)}</option>`] : [];
    options.forEach((option) => {
      values.push(`<option value="${escapeHtml(option)}"${option === selected ? " selected" : ""}>${escapeHtml(option)}</option>`);
    });
    return values.join("");
  }

  function render() {
    const tab = state.activeTab;
    navItems.forEach((item, index) => {
      const active = item.dataset.tab === tab;
      item.classList.toggle("active", active);
      item.toggleAttribute("aria-current", active);
      if (active) navIndicator.style.transform = `translateX(${index * 100}%)`;
    });

    const renderers = {
      today: renderToday,
      plan: renderPlan,
      ge: renderGe,
      apply: renderApply,
      playbook: renderPlaybook
    };

    main.classList.remove("view-entering", "view-leaving");
    main.innerHTML = renderers[tab]();
    void main.offsetWidth;
    main.classList.add("view-entering");
    afterRender(tab);
  }

  function renderToday() {
    const now = localMidnight();
    const deadline = getNextHardDeadline(now);
    const days = deadline ? Math.max(0, diffCalendarDays(now, parseDate(deadline.date))) : 0;
    const currentTerm = getCurrentTerm(now);
    const termProgress = getTermProgress(currentTerm, now);
    const thisWeek = getThisWeekItems(now);
    const nextDates = DATA.milestones
      .filter((item) => parseDate(item.date) >= now)
      .sort((a, b) => parseDate(a.date) - parseDate(b.date))
      .slice(0, 3);
    const urgent = deadline && days <= 7;

    return `
      <section class="screen-header">
        <p class="eyebrow">${escapeHtml(currentTerm.name)} · ${escapeHtml(DATA.profile.majorTrack)}</p>
        <h1 class="screen-title">Today</h1>
      </section>

      <section class="hero-card${urgent ? " hero-plate" : ""}" aria-labelledby="nextDeadlineLabel">
        <p class="eyebrow" id="nextDeadlineLabel">NEXT HARD DEADLINE</p>
        <p class="hero-number"><span id="heroCount" data-target="${days}">0</span><span class="hero-unit">${days === 1 ? "day" : "days"}</span></p>
        <p class="hero-detail stagger-line">${deadline ? `${escapeHtml(deadline.title)} · ${escapeHtml(formatDateLong(deadline.date))}` : "No remaining hard deadlines in the stored timeline."}${deadline && deadline.verify ? " · Confirm the date." : ""}</p>
      </section>

      <section class="term-meter-wrap" aria-label="Current term progress">
        <div class="term-meter-meta">
          <span class="micro-label">${escapeHtml(currentTerm.name)}</span>
          <span class="micro-label">${escapeHtml(termProgress.label)}</span>
        </div>
        <div class="hairline-meter"><span id="termMeter" data-progress="${termProgress.percent.toFixed(2)}"></span></div>
      </section>

      <section class="section-gap card" aria-labelledby="thisWeekTitle">
        <p class="eyebrow">ACTION FILTER</p>
        <h3 id="thisWeekTitle">This week</h3>
        <ul class="compact-list">
          ${thisWeek.length ? thisWeek.map((item) => `
            <li class="compact-row">
              <div>
                <p class="row-title">${escapeHtml(item.title)}</p>
                <p class="row-detail">${escapeHtml(item.detail)}</p>
              </div>
            </li>`).join("") : `
            <li class="compact-row"><p class="row-title">Nothing due. Bank the grades.</p></li>`}
        </ul>
      </section>

      <section class="section-gap card" aria-labelledby="nextDatesTitle">
        <p class="eyebrow">FORWARD VIEW</p>
        <h3 id="nextDatesTitle">Next three dates</h3>
        <ul class="date-list">
          ${nextDates.map((item) => `
            <li class="date-row">
              <span class="date-label">${escapeHtml(formatDate(item.date, { month: "short" }))}</span>
              <div>
                <p class="row-title">${escapeHtml(item.title)}${item.verify ? ` <span class="confirm-chip">Confirm</span>` : ""}</p>
                <p class="row-detail">${escapeHtml(item.category)}${item.noClass ? " · Lower priority" : ""}</p>
              </div>
            </li>`).join("")}
        </ul>
        <button type="button" class="primary-button full-button" data-action="export-calendar">Add all dates to Calendar</button>
      </section>

      <details class="accordion bare-accordion section-gap">
        <summary>
          <span class="summary-text"><span class="summary-title">Open decisions</span><span class="summary-meta">${DATA.decisions.filter((item) => !state.decisions[item.id]).length} unresolved</span></span>
          <span class="chevron" aria-hidden="true"></span>
        </summary>
        <div class="accordion-body"><div class="accordion-inner"><div class="accordion-content section-stack">
          ${DATA.decisions.map(renderDecisionCard).join("")}
        </div></div></div>
      </details>
    `;
  }

  function renderDecisionCard(decision) {
    const selected = state.decisions[decision.id];
    return `
      <section class="decision-card">
        <p class="eyebrow">DECISION · DUE ${escapeHtml(formatDateLong(decision.due))}</p>
        <h3>${escapeHtml(decision.title)}</h3>
        <p class="muted">${escapeHtml(decision.detail)}</p>
        <label class="field-label" for="decision-${escapeHtml(decision.id)}">Resolution</label>
        <select class="select-control" id="decision-${escapeHtml(decision.id)}" data-action="decision" data-id="${escapeHtml(decision.id)}">
          ${selectOptions(decision.options, selected, "Unresolved")}
        </select>
      </section>
    `;
  }

  function renderPlan() {
    const metrics = calculateUnitsAndGpa();
    const currentTerm = getCurrentTerm();
    const gpaDisplay = metrics.gpa === null ? "—" : metrics.gpa.toFixed(2);
    const capMessage = metrics.totalPlanUnits > DATA.profile.unitSoftCap
      ? `${metrics.totalPlanUnits} planned units exceeds the ${DATA.profile.unitSoftCap}-unit UC community-college credit cap. Extra units may not add transfer credit.`
      : `${metrics.totalPlanUnits} units mapped. UC applies a soft transfer-credit cap at ${DATA.profile.unitSoftCap} community-college semester units.`;

    return `
      <section class="screen-header">
        <p class="eyebrow">TWO-YEAR RECORD</p>
        <h1 class="screen-title">Plan</h1>
        <p class="screen-intro">The Spine tracks every term, every course, and the arithmetic that decides whether the plan closes.</p>
      </section>

      <div class="plan-layout" id="planSpine" aria-label="The Spine transfer plan">
        <span class="spine-base" aria-hidden="true"></span>
        <span class="spine-progress" id="spineProgress" aria-hidden="true"></span>
        ${DATA.terms.map((term) => renderTerm(term, term.id === currentTerm.id)).join("")}
      </div>

      <details class="accordion section-gap" open>
        <summary>
          <span class="summary-text"><span class="summary-title">GPA math</span><span class="summary-meta">Target ${state.targetGpa.toFixed(2)}</span></span>
          <span class="chevron" aria-hidden="true"></span>
        </summary>
        <div class="accordion-body"><div class="accordion-inner"><div class="accordion-content">
          <p class="gpa-number">${gpaDisplay}</p>
          <p class="muted">${escapeHtml(getGpaMessage(metrics))}</p>
          <p class="micro-copy">${escapeHtml(capMessage)}</p>
        </div></div></div>
      </details>

      <div class="plan-footer mono${metrics.activeUnits >= DATA.profile.unitGoal ? " goal-met" : ""}">
        <span id="unitCounter">${metrics.activeUnits}</span> / ${DATA.profile.unitGoal} ACTIVE UNITS · ${metrics.plannedUnits} PLANNED · GPA ${gpaDisplay}
      </div>
    `;
  }

  function renderTerm(term, isCurrent) {
    const phase = getTermPhase(term);
    const termDone = term.courses.every((course) => getCourseState(course.id).done);
    const nodeClass = termDone || phase === "done" ? "completed" : isCurrent ? `current${spineHasDrawn ? "" : " first-visit"}` : "";
    const statusLabel = termDone || phase === "done" ? "Done" : phase === "current" ? "In progress" : "Planned";

    return `
      <div class="term-block" data-term-id="${escapeHtml(term.id)}">
        <span class="term-node ${nodeClass}" data-term-node="${escapeHtml(term.id)}" aria-hidden="true"></span>
        <details class="accordion term-accordion"${isCurrent ? " open" : ""}>
          <summary class="term-summary">
            <span class="summary-text">
              <span class="term-name">${escapeHtml(term.name)}</span>
              <span class="summary-meta">${escapeHtml(formatDateRange(term.start, term.end))} · ${termTotalUnits(term)} units</span>
              <span class="status-label ${phase === "planned" ? "planned" : ""}">${escapeHtml(statusLabel)}</span>
            </span>
            <span class="chevron" aria-hidden="true"></span>
          </summary>
          <div class="accordion-body"><div class="accordion-inner"><div class="accordion-content">
            ${term.note ? `<p class="muted">${escapeHtml(term.note)}</p>` : ""}
            <div class="course-list">
              ${term.courses.map(renderCourseRow).join("")}
            </div>
          </div></div></div>
        </details>
      </div>
    `;
  }

  function renderCourseRow(course) {
    const courseState = getCourseState(course.id);
    const showGrade = courseState.done || Boolean(courseState.grade);
    return `
      <div class="course-row${courseState.done ? " done" : ""}${pendingCompletedCourseId === course.id ? " just-completed" : ""}" data-course-row="${escapeHtml(course.id)}">
        <button type="button" class="course-check" data-action="toggle-course" data-id="${escapeHtml(course.id)}" aria-pressed="${courseState.done}" aria-label="${courseState.done ? "Mark incomplete" : "Mark complete"}: ${escapeHtml(course.code)}">
          <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 12.5 9.5 17 19 7.5"></path></svg>
        </button>
        <div class="course-main">
          <div class="course-heading"><span class="course-code">${escapeHtml(course.code)}</span><span class="course-units">${course.units} UNIT${course.units === 1 ? "" : "S"}</span></div>
          <p class="course-title">${escapeHtml(course.title)}</p>
          <p class="course-meta">${escapeHtml(course.category)} · ${escapeHtml(coursePlanStatus(course))}</p>
          ${course.schedule ? `<p class="course-note">${escapeHtml(course.schedule)}</p>` : ""}
          ${course.note ? `<p class="course-note">${escapeHtml(course.note)}</p>` : ""}
          ${showGrade ? `
            <div class="grade-wrap">
              <label class="field-label" for="grade-${escapeHtml(course.id)}">Grade</label>
              <select class="select-control mono" id="grade-${escapeHtml(course.id)}" data-action="grade" data-id="${escapeHtml(course.id)}">
                ${selectOptions(gradeOptions.filter(Boolean), courseState.grade, "Enter grade")}
              </select>
            </div>` : ""}
        </div>
      </div>
    `;
  }

  function renderGe() {
    const coverage = buildCalGetcCoverage();
    const circumference = 2 * Math.PI * 40;
    const offset = circumference * (1 - coverage.covered / DATA.calGetcAreas.length);

    return `
      <section class="screen-header">
        <p class="eyebrow">CAL-GETC + COURSE VALUE</p>
        <h1 class="screen-title">GE</h1>
        <p class="screen-intro">Certification and major preparation are separate tracks. This screen refuses the double-counting traps.</p>
      </section>

      <details class="accordion" open>
        <summary>
          <span class="summary-text"><span class="summary-title">Cal-GETC coverage</span><span class="summary-meta">${coverage.covered} covered · ${coverage.mapped} mapped</span></span>
          <span class="chevron" aria-hidden="true"></span>
        </summary>
        <div class="accordion-body"><div class="accordion-inner"><div class="accordion-content">
          <div class="ring-layout">
            <div class="coverage-ring" role="img" aria-label="${coverage.covered} of 11 Cal-GETC areas covered">
              <svg viewBox="0 0 92 92" aria-hidden="true">
                <circle class="ring-track" cx="46" cy="46" r="40"></circle>
                <circle class="ring-value" cx="46" cy="46" r="40" stroke-dasharray="${circumference.toFixed(2)}" stroke-dashoffset="${offset.toFixed(2)}"></circle>
              </svg>
              <div class="ring-text"><strong>${coverage.covered} / 11</strong><span>covered</span></div>
            </div>
            <div>
              <h3>${coverage.mapped} / 11 areas mapped</h3>
              <p class="muted">Covered means completed with at least 3 units and a C or better. Planned courses stay planned until the grade exists.</p>
            </div>
          </div>

          <ul class="coverage-list">
            ${coverage.rows.map((row) => {
              const courseLabel = row.courses.length ? row.courses.map((course) => course.code).join(" + ") : "OPEN";
              return `
                <li class="coverage-row">
                  <span class="coverage-area">${escapeHtml(row.code)}</span>
                  <div><p class="row-title">${escapeHtml(row.name)}</p><p class="row-detail">${escapeHtml(row.status)}</p></div>
                  <span class="coverage-course ${row.status === "planned" ? "planned" : row.status === "open" ? "open" : ""}">${escapeHtml(courseLabel)}</span>
                </li>`;
            }).join("")}
          </ul>
          <p class="micro-copy">Area 4 requires two different disciplines. ECON C2001 and ECON C2002 cannot form the pair. A single dual-listed course is assigned once; BIOL 3's defined lecture-and-lab pairing is the science exception.</p>
        </div></div></div>
      </details>

      <details class="accordion section-gap">
        <summary>
          <span class="summary-text"><span class="summary-title">GE tier list</span><span class="summary-meta">S through D</span></span>
          <span class="chevron" aria-hidden="true"></span>
        </summary>
        <div class="accordion-body"><div class="accordion-inner"><div class="accordion-content">
          <p class="muted">Ranked on: does it close a required area, is it useful to the work, and what does it cost in hours per unit.</p>
          ${DATA.geTiers.map(renderTierGroup).join("")}
        </div></div></div>
      </details>
    `;
  }

  function renderTierGroup(group) {
    return `
      <details class="accordion sub-accordion tier-group"${group.tier === "S" ? " open" : ""}>
        <summary>
          <span class="summary-text"><span class="summary-title">${escapeHtml(group.tier)} tier</span><span class="summary-meta">${escapeHtml(group.title)}</span></span>
          <span class="chevron" aria-hidden="true"></span>
        </summary>
        <div class="accordion-body"><div class="accordion-inner"><div class="accordion-content">
          ${group.entries.map((entry) => `
            <article class="tier-card ${group.tier === "S" ? "s-tier" : ""} ${group.tier === "D" ? "d-tier" : ""}">
              <div class="tier-heading"><div><span class="course-code">${escapeHtml(entry.code)}</span><h3>${escapeHtml(entry.title)}</h3></div><span class="tier-badge">${escapeHtml(group.tier)} · ${entry.units}U · ${escapeHtml(entry.area)}</span></div>
              <p class="row-detail"><strong>Why:</strong> ${escapeHtml(entry.why)}</p>
              <p class="row-detail"><strong>Watch:</strong> ${escapeHtml(entry.watch)}</p>
            </article>`).join("")}
        </div></div></div>
      </details>
    `;
  }

  function renderApply() {
    const applicationMilestones = DATA.milestones.filter((item) => parseDate(item.date) >= parseDate("2027-08-01") && parseDate(item.date) <= parseDate("2028-07-01") && !item.noClass);
    const majorPrepCodes = ["ACCTG 1", "ACCTG 2", "ECON C2001", "ECON C2002", "MATH 7", "MATH 8", "STAT C1000"];
    const majorPrepPlanned = majorPrepCodes.every((code) => courseByCode.has(code));

    return `
      <section class="screen-header">
        <p class="eyebrow">FALL 2028 ADMISSION</p>
        <h1 class="screen-title">Apply</h1>
        <p class="screen-intro">Requirements come from ASSIST and official pages. Selectivity notes are manual because the app makes no background network calls.</p>
      </section>

      <section class="card">
        <p class="eyebrow">MAJOR PREP POSITION</p>
        <h3>${majorPrepPlanned ? "Seven required prep courses are mapped by Fall 2027." : "The seven-course major-prep set is incomplete."}</h3>
        <p class="muted">ACCTG 1–2, ECON C2001–C2002, MATH 7–8, and STAT C1000 are scheduled before UC decisions. Verify every articulation agreement for the catalog year used.</p>
      </section>

      <details class="accordion section-gap">
        <summary>
          <span class="summary-text"><span class="summary-title">Application timeline</span><span class="summary-meta">Aug 2027 – Jul 2028</span></span>
          <span class="chevron" aria-hidden="true"></span>
        </summary>
        <div class="accordion-body"><div class="accordion-inner"><div class="accordion-content">
          <div class="timeline">
            ${applicationMilestones.map((item) => `
              <article class="timeline-item">
                <span class="timeline-node" aria-hidden="true"></span>
                <p class="timeline-date">${escapeHtml(formatDateLong(item.date))}${item.verify ? " · CONFIRM" : ""}</p>
                <p class="timeline-title">${escapeHtml(item.title)}${item.verify ? ` <span class="confirm-chip">Confirm</span>` : ""}</p>
                ${item.detail ? `<p class="timeline-detail">${escapeHtml(item.detail)}</p>` : ""}
              </article>`).join("")}
          </div>
        </div></div></div>
      </details>

      <div class="section-gap section-stack">
        ${DATA.campuses.map(renderCampus).join("")}
      </div>

      <details class="accordion section-gap" open>
        <summary>
          <span class="summary-text"><span class="summary-title">TAG, TAP, and CCCP</span><span class="summary-meta">Three separate tracks</span></span>
          <span class="chevron" aria-hidden="true"></span>
        </summary>
        <div class="accordion-body"><div class="accordion-inner"><div class="accordion-content">
          ${renderTrackerRow("tag", "UCI TAG", "A guarantee only if the exact major remains eligible and every condition is met. Business Administration is not TAG-eligible. Business Economics requires confirmation under the 2027–28 matrix.")}
          ${renderTrackerRow("tap", "UCLA TAP through SMC Scholars", "Priority consideration, not guaranteed UCLA admission. Confirm the 2027 certification rules; an early Scholars start matters.")}
          ${renderTrackerRow("cccp", "UCLA CCCP", "A separate preparation and support opportunity. It is not TAP and not an admission guarantee.")}
        </div></div></div>
      </details>

      <section class="card section-gap">
        <p class="eyebrow">TRANSFER SAFETY LADDER</p>
        <ol class="safety-list">${DATA.safetyLadder.map((item) => `<li>${escapeHtml(item)}</li>`).join("")}</ol>
      </section>

      <details class="accordion section-gap">
        <summary>
          <span class="summary-text"><span class="summary-title">If rejected</span><span class="summary-meta">Collapsed until needed</span></span>
          <span class="chevron" aria-hidden="true"></span>
        </summary>
        <div class="accordion-body"><div class="accordion-inner"><div class="accordion-content">
          <ol class="rejection-list">${DATA.rejectionWorkflow.map((item) => `<li>${escapeHtml(item)}</li>`).join("")}</ol>
        </div></div></div>
      </details>
    `;
  }

  function renderCampus(campus) {
    const notes = state.campusNotes[campus.id];
    const dashboardUrl = DATA.resources.find((resource) => resource.label === "UC Transfer by Major").url;
    const isUc = campus.id !== "usc";

    return `
      <details class="accordion">
        <summary>
          <span class="summary-text"><span class="summary-title">${escapeHtml(campus.campus)}</span><span class="summary-meta">${escapeHtml(campus.program)}</span></span>
          <span class="chevron" aria-hidden="true"></span>
        </summary>
        <div class="accordion-body"><div class="accordion-inner"><div class="accordion-content">
          <ul class="requirement-list">
            ${campus.requirements.map((code) => {
              const course = courseByCode.get(code);
              const status = course ? coursePlanStatus(course) : "not in plan";
              return `
                <li class="requirement-row${course ? " in-plan" : ""}">
                  <span class="requirement-status">${course ? "✓" : "○"}</span>
                  <div class="requirement-copy"><div class="requirement-name">${escapeHtml(code)}</div><div class="requirement-sub">${escapeHtml(status)}</div></div>
                </li>`;
            }).join("")}
          </ul>
          <p class="muted">${escapeHtml(campus.context)}</p>

          <div class="gpa-callout">
            <p class="eyebrow">MAJOR SELECTIVITY · MANUAL LOG</p>
            <h3>${escapeHtml(campus.selectivityMajor)}</h3>
            <p class="muted">Campus-wide admission rates are not substitutes for major-level applicant, admit, admit-rate, and GPA data.</p>
            ${isUc ? `<a class="secondary-button" href="${escapeHtml(dashboardUrl)}" target="_blank" rel="noopener noreferrer">Open UC Transfer by Major</a>` : ""}
            <label class="field-label" for="checked-${escapeHtml(campus.id)}">Last checked</label>
            <input class="text-input mono" id="checked-${escapeHtml(campus.id)}" type="date" data-action="campus-checked" data-id="${escapeHtml(campus.id)}" value="${escapeHtml(notes.checked)}">
            <label class="field-label" for="notes-${escapeHtml(campus.id)}">Applicant count, admit count, admit rate, GPA range, and source notes</label>
            <textarea class="text-area" id="notes-${escapeHtml(campus.id)}" data-action="campus-notes" data-id="${escapeHtml(campus.id)}">${escapeHtml(notes.notes)}</textarea>
          </div>

          <p class="campus-footer"><a href="https://assist.org/" target="_blank" rel="noopener noreferrer">Verify on ASSIST for your catalog year.</a></p>
        </div></div></div>
      </details>
    `;
  }

  function renderTrackerRow(id, title, detail) {
    return `
      <div class="tracker-row">
        <div>
          <p class="row-title">${escapeHtml(title)}</p>
          <p class="row-detail">${escapeHtml(detail)}</p>
        </div>
        <select class="select-control" data-action="tracker" data-id="${escapeHtml(id)}" aria-label="${escapeHtml(title)} status">
          ${selectOptions(trackerOptions, state.trackers[id], "")}
        </select>
      </div>
    `;
  }

  function renderPlaybook() {
    const sortedLogs = [...state.counselorLog].sort((a, b) => parseDate(b.date) - parseDate(a.date));
    const latest = sortedLogs[0];
    const daysSince = latest ? Math.max(0, diffCalendarDays(parseDate(latest.date), localMidnight())) : null;
    const reminder = latest
      ? `Last visit: ${daysSince} day${daysSince === 1 ? "" : "s"} ago.`
      : "No visits logged. The first one is the one that changes the advice.";

    return `
      <section class="screen-header">
        <p class="eyebrow">TACTICS, NOT REQUIREMENTS</p>
        <h1 class="screen-title">Playbook</h1>
        <p class="screen-intro">Official sources control requirements. Student experience supplies tactics, warnings, and better questions.</p>
      </section>

      <div class="section-stack">
        ${DATA.playbook.map((section, index) => `
          <details class="accordion"${index === 0 ? " open" : ""}>
            <summary>
              <span class="summary-text"><span class="summary-title">${escapeHtml(section.title)}</span><span class="summary-meta">${section.items.length} directives</span></span>
              <span class="chevron" aria-hidden="true"></span>
            </summary>
            <div class="accordion-body"><div class="accordion-inner"><div class="accordion-content">
              <ul class="playbook-list">${section.items.map((item) => `<li>${escapeHtml(item)}</li>`).join("")}</ul>
            </div></div></div>
          </details>`).join("")}
      </div>

      <section class="card section-gap" aria-labelledby="counselorLogTitle">
        <p class="eyebrow">LOCAL RECORD</p>
        <h3 id="counselorLogTitle">Counselor log</h3>
        <p class="reminder-line${daysSince !== null && daysSince > 42 ? " overdue" : ""}">${escapeHtml(reminder)}</p>

        <ul class="counselor-list">
          ${sortedLogs.length ? sortedLogs.map((entry) => `
            <li class="log-row">
              <div><span class="log-date">${escapeHtml(formatDateLong(entry.date))}</span><p class="log-notes">${escapeHtml(entry.notes)}</p></div>
              <button type="button" class="quiet-button" data-action="delete-log" data-id="${escapeHtml(entry.id)}">Delete</button>
            </li>`).join("") : ""}
        </ul>

        <form class="log-form" id="counselorLogForm">
          <label class="field-label" for="counselorDate">Visit date</label>
          <input class="text-input mono" id="counselorDate" name="date" type="date" required>
          <label class="field-label" for="counselorNotes">Counselor, advice, and items to verify</label>
          <textarea class="text-area" id="counselorNotes" name="notes" required maxlength="3000"></textarea>
          <button type="submit" class="primary-button full-button">Save visit</button>
        </form>
      </section>
    `;
  }

  function afterRender(tab) {
    if (tab === "today") {
      animateCount(document.getElementById("heroCount"));
      requestAnimationFrame(() => {
        const meter = document.getElementById("termMeter");
        if (meter) meter.style.width = `${meter.dataset.progress}%`;
      });
    }
    if (tab === "plan") {
      requestAnimationFrame(() => {
        updateSpine();
        if (pendingUnitAnimation) {
          animateNumber(document.getElementById("unitCounter"), pendingUnitAnimation.from, pendingUnitAnimation.to, 280);
          pendingUnitAnimation = null;
        }
        pendingCompletedCourseId = null;
      });
    }
  }

  function animateCount(element) {
    if (!element) return;
    animateNumber(element, 0, Number(element.dataset.target || 0), 600);
  }

  function animateNumber(element, from, to, duration) {
    if (!element) return;
    if (prefersReducedMotion.matches || from === to) {
      element.textContent = String(to);
      return;
    }
    const started = performance.now();
    const tick = (now) => {
      const progress = Math.min(1, (now - started) / duration);
      const eased = 1 - Math.pow(1 - progress, 3);
      element.textContent = String(Math.round(from + (to - from) * eased));
      if (progress < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  }

  function updateSpine() {
    const layout = document.getElementById("planSpine");
    const progressLine = document.getElementById("spineProgress");
    if (!layout || !progressLine) return;
    const nodes = Array.from(layout.querySelectorAll("[data-term-node]"));
    if (!nodes.length) return;

    const currentTerm = getCurrentTerm();
    const currentIndex = DATA.terms.findIndex((term) => term.id === currentTerm.id);
    const currentNode = nodes[currentIndex] || nodes[0];
    const nextNode = nodes[currentIndex + 1];
    const layoutRect = layout.getBoundingClientRect();
    const nodeRect = currentNode.getBoundingClientRect();
    const startTop = 18;
    const currentCenter = nodeRect.top - layoutRect.top + nodeRect.height / 2;
    let target = Math.max(0, currentCenter - startTop);

    if (nextNode) {
      const nextRect = nextNode.getBoundingClientRect();
      const nextCenter = nextRect.top - layoutRect.top + nextRect.height / 2;
      const elapsed = getTermProgress(currentTerm).percent / 100;
      target += (nextCenter - currentCenter) * elapsed;
    }

    progressLine.classList.toggle("no-animate", spineHasDrawn || prefersReducedMotion.matches);
    progressLine.style.height = `${Math.min(target, layout.offsetHeight - 36)}px`;
    spineHasDrawn = true;
  }

  function exportCalendar() {
    const stamp = new Date().toISOString().replaceAll(/[-:]/g, "").replace(/\.\d{3}Z$/, "Z");
    const lines = [
      "BEGIN:VCALENDAR",
      "VERSION:2.0",
      "PRODID:-//Bobby Transfer Command//EN",
      "CALSCALE:GREGORIAN",
      "METHOD:PUBLISH",
      "X-WR-CALNAME:Bobby Transfer Command"
    ];

    DATA.milestones.forEach((item) => {
      const start = item.date.replaceAll("-", "");
      const end = (item.endDate || addDays(item.date, 1)).replaceAll("-", "");
      const uid = `${item.date}-${slugify(item.title)}@bobby-transfer-command`;
      const summary = `${item.category}: ${item.title}${item.verify ? " [CONFIRM]" : ""}`;
      lines.push(
        "BEGIN:VEVENT",
        `UID:${uid}`,
        `DTSTAMP:${stamp}`,
        `DTSTART;VALUE=DATE:${start}`,
        `DTEND;VALUE=DATE:${end}`,
        `SUMMARY:${escapeIcs(summary)}`,
        `DESCRIPTION:${escapeIcs(item.detail || (item.noClass ? "Lower-priority no-class marker." : "Open Transfer Command for context."))}`,
        "BEGIN:VALARM",
        "TRIGGER:-P2D",
        "ACTION:DISPLAY",
        `DESCRIPTION:${escapeIcs(`Upcoming: ${item.title}`)}`,
        "END:VALARM",
        "END:VEVENT"
      );
    });

    lines.push("END:VCALENDAR");
    downloadBlob(new Blob([`${lines.join("\r\n")}\r\n`], { type: "text/calendar;charset=utf-8" }), "bobby-transfer-command.ics");
    showToast("Calendar file created with two-day reminders.");
  }

  function addDays(dateString, days) {
    const date = parseDate(dateString);
    date.setDate(date.getDate() + days);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  }

  function escapeIcs(value) {
    return String(value).replaceAll("\\", "\\\\").replaceAll(";", "\\;").replaceAll(",", "\\,").replaceAll(/\r?\n/g, "\\n");
  }

  function slugify(value) {
    return String(value).toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "").slice(0, 50);
  }

  function downloadBlob(blob, filename) {
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = filename;
    document.body.append(anchor);
    anchor.click();
    anchor.remove();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  }

  function exportState() {
    const payload = {
      app: DATA.app.name,
      version: DATA.app.version,
      exportedAt: new Date().toISOString(),
      state
    };
    downloadBlob(new Blob([JSON.stringify(payload, null, 2)], { type: "application/json" }), DATA.app.stateExportName);
    showToast("Local data exported.");
  }

  async function importState(file) {
    if (!file) return;
    try {
      const text = await file.text();
      const parsed = JSON.parse(text);
      const incoming = parsed && parsed.state ? parsed.state : parsed;
      state = mergeState(incoming);
      saveState();
      targetGpaInput.value = state.targetGpa.toFixed(2);
      render();
      showToast("Backup imported.");
    } catch (error) {
      console.warn(error);
      showToast("That file is not a valid Transfer Command backup.");
    } finally {
      importStateInput.value = "";
    }
  }

  function showToast(message) {
    clearTimeout(toastTimer);
    toast.textContent = message;
    toast.classList.add("show");
    toastTimer = window.setTimeout(() => toast.classList.remove("show"), 2600);
  }

  function renderSettings() {
    targetGpaInput.value = state.targetGpa.toFixed(2);
    resourceLinks.innerHTML = DATA.resources.map((resource) => `
      <a class="resource-link" href="${escapeHtml(resource.url)}" target="_blank" rel="noopener noreferrer">${escapeHtml(resource.label)}</a>
    `).join("");
    versionLine.textContent = `Version ${DATA.app.version} · source review ${DATA.app.sourceReviewed}`;
  }

  nav.addEventListener("click", (event) => {
    const button = event.target.closest(".nav-item");
    if (!button) return;
    const tab = button.dataset.tab;
    if (!tab || tab === state.activeTab) return;
    if (state.activeTab === "plan") spineHasDrawn = false;
    main.classList.add("view-leaving");
    window.setTimeout(() => {
      state.activeTab = tab;
      saveState();
      window.scrollTo({ top: 0, behavior: prefersReducedMotion.matches ? "auto" : "smooth" });
      render();
    }, prefersReducedMotion.matches ? 0 : 100);
  });

  main.addEventListener("click", (event) => {
    const actionElement = event.target.closest("[data-action]");
    if (!actionElement) return;
    const action = actionElement.dataset.action;
    const id = actionElement.dataset.id;

    if (action === "export-calendar") exportCalendar();

    if (action === "toggle-course" && courseById.has(id)) {
      const before = calculateUnitsAndGpa().activeUnits;
      const willComplete = !state.courses[id].done;
      state.courses[id].done = willComplete;
      if (!willComplete) state.courses[id].grade = "";
      const after = calculateUnitsAndGpa().activeUnits;
      pendingUnitAnimation = { from: before, to: after };
      pendingCompletedCourseId = willComplete ? id : null;
      saveState();
      render();
      if (after > before) showToast(`${courseById.get(id).code} complete. Active units: ${after}.`);
    }

    if (action === "delete-log") {
      state.counselorLog = state.counselorLog.filter((entry) => entry.id !== id);
      saveState();
      render();
      showToast("Counselor visit deleted.");
    }
  });

  main.addEventListener("change", (event) => {
    const target = event.target;
    const action = target.dataset.action;
    const id = target.dataset.id;
    if (!action) return;

    if (action === "grade" && state.courses[id]) {
      state.courses[id].grade = gradeOptions.includes(target.value) ? target.value : "";
      if (target.value) state.courses[id].done = true;
      saveState();
      render();
    }

    if (action === "decision" && Object.hasOwn(state.decisions, id)) {
      state.decisions[id] = target.value;
      saveState();
      render();
    }

    if (action === "tracker" && Object.hasOwn(state.trackers, id)) {
      state.trackers[id] = trackerOptions.includes(target.value) ? target.value : "Not started";
      saveState();
    }

    if (action === "campus-checked" && state.campusNotes[id]) {
      state.campusNotes[id].checked = target.value;
      saveState();
    }
  });

  main.addEventListener("input", (event) => {
    const target = event.target;
    if (target.dataset.action === "campus-notes" && state.campusNotes[target.dataset.id]) {
      state.campusNotes[target.dataset.id].notes = target.value.slice(0, 2000);
      saveState();
    }
  });

  main.addEventListener("submit", (event) => {
    if (event.target.id !== "counselorLogForm") return;
    event.preventDefault();
    const formData = new FormData(event.target);
    const date = String(formData.get("date") || "");
    const notes = String(formData.get("notes") || "").trim();
    if (!date || !notes) return;
    state.counselorLog.push({ id: cryptoRandomId(), date, notes });
    saveState();
    render();
    showToast("Counselor visit saved.");
  });

  main.addEventListener("toggle", (event) => {
    if (state.activeTab === "plan" && event.target.matches("details")) {
      window.setTimeout(updateSpine, prefersReducedMotion.matches ? 0 : 290);
    }
  }, true);

  window.addEventListener("resize", () => {
    if (state.activeTab === "plan") updateSpine();
  });

  settingsButton.addEventListener("click", () => {
    renderSettings();
    settingsDialog.showModal();
  });

  targetGpaInput.addEventListener("change", () => {
    const value = Number(targetGpaInput.value);
    if (!Number.isFinite(value) || value < 0 || value > 4) {
      targetGpaInput.value = state.targetGpa.toFixed(2);
      showToast("Target GPA must be between 0.00 and 4.00.");
      return;
    }
    state.targetGpa = Math.round(value * 100) / 100;
    saveState();
    if (state.activeTab === "plan") render();
  });

  exportStateButton.addEventListener("click", exportState);
  importStateInput.addEventListener("change", () => importState(importStateInput.files[0]));
  resetStateButton.addEventListener("click", () => {
    const confirmed = window.confirm("Reset every grade, decision, note, and counselor visit stored on this device?");
    if (!confirmed) return;
    state = createDefaultState();
    saveState();
    settingsDialog.close();
    render();
    showToast("Local data reset.");
  });

  settingsDialog.addEventListener("click", (event) => {
    const rect = settingsDialog.getBoundingClientRect();
    const outside = event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom;
    if (outside) settingsDialog.close();
  });

  if ("serviceWorker" in navigator) {
    window.addEventListener("load", () => {
      navigator.serviceWorker.register("./sw.js").catch((error) => console.warn("Service worker registration failed.", error));
    });
  }

  renderSettings();
  render();
})();
