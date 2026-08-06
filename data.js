/* Static content only. User-entered state is stored separately in localStorage. */
window.APP_DATA = Object.freeze({
  app: {
    name: "Transfer Command",
    version: "1.1.0",
    sourceReviewed: "August 5, 2026",
    storageKey: "bobby.transferCommand.v1",
    stateExportName: "bobby-transfer-command-backup.json"
  },

  profile: {
    name: "Bobby",
    college: "Santa Monica College",
    startTerm: "Summer 2026",
    transferTerm: "Fall 2028",
    targetCampuses: ["UC Irvine", "UCLA", "USC"],
    majorTrack: "Business / Business Economics",
    unitGoal: 60,
    unitSoftCap: 70,
    targetGpa: 3.70
  },

  grades: {
    "A": 4.0,
    "A-": 3.7,
    "B+": 3.3,
    "B": 3.0,
    "B-": 2.7,
    "C+": 2.3,
    "C": 2.0,
    "C-": 1.7,
    "D+": 1.3,
    "D": 1.0,
    "D-": 0.7,
    "F": 0.0,
    "P": null,
    "W": null
  },

  calGetcAreas: [
    { code: "1A", name: "English composition" },
    { code: "1B", name: "Critical thinking and composition" },
    { code: "1C", name: "Oral communication" },
    { code: "2", name: "Mathematical concepts" },
    { code: "3A", name: "Arts" },
    { code: "3B", name: "Humanities" },
    { code: "4", name: "Social and behavioral sciences · two disciplines" },
    { code: "5A", name: "Physical science" },
    { code: "5B", name: "Biological science" },
    { code: "5C", name: "Laboratory activity" },
    { code: "6", name: "Ethnic studies" }
  ],

  terms: [
    {
      id: "summer-2026",
      name: "Summer 2026",
      start: "2026-06-22",
      end: "2026-08-01",
      status: "done",
      note: "Completed term.",
      courses: [
        {
          id: "bus-1",
          code: "BUS 1",
          title: "Introduction to Business",
          units: 3,
          category: "Elective",
          transferable: true,
          defaultDone: true,
          defaultGrade: "C",
          areas: [],
          note: "Transferable elective. Counts toward units but not toward any Cal-GETC area."
        }
      ]
    },
    {
      id: "fall-2026",
      name: "Fall 2026",
      start: "2026-08-31",
      end: "2026-12-22",
      status: "current",
      note: "Current registration record.",
      courses: [
        {
          id: "acctg-1",
          code: "ACCTG 1",
          title: "Financial Accounting",
          units: 5,
          category: "Major prep",
          transferable: true,
          inProgress: true,
          defaultDone: false,
          defaultGrade: "",
          areas: [],
          schedule: "Tue/Thu · 12:45–3:10pm · Main Campus CPC 104 · Professor Knight"
        },
        {
          id: "econ-c2001",
          code: "ECON C2001",
          title: "Principles of Microeconomics",
          units: 3,
          category: "Major prep",
          transferable: true,
          inProgress: true,
          defaultDone: false,
          defaultGrade: "",
          areas: ["4"],
          preferredArea: "4",
          discipline: "Economics",
          schedule: "Online · Flexible schedule · Professor Su"
        },
        {
          id: "engl-c1000",
          code: "ENGL C1000",
          title: "College Composition",
          units: 3,
          category: "Requirement",
          transferable: true,
          inProgress: true,
          defaultDone: false,
          defaultGrade: "",
          areas: ["1A"],
          preferredArea: "1A",
          schedule: "Mon/Wed · 9:30–10:50am · Online · Professor Stirling"
        },
        {
          id: "ahis-11",
          code: "AHIS 11",
          title: "Art History",
          units: 3,
          category: "GE",
          transferable: true,
          inProgress: true,
          defaultDone: false,
          defaultGrade: "",
          areas: ["3A"],
          preferredArea: "3A",
          schedule: "Online · Flexible schedule · Professor Ahmadpour"
        }
      ]
    },
    {
      id: "winter-2027",
      name: "Winter 2027",
      start: "2027-01-04",
      end: "2027-02-11",
      status: "planned",
      note: "Six-week session. One course only. Winter moves fast.",
      courses: [
        {
          id: "math-2",
          code: "MATH 2",
          title: "Precalculus",
          units: 5,
          category: "Gateway course",
          transferable: true,
          defaultDone: false,
          defaultGrade: "",
          areas: [],
          conditional: true,
          note: "Only needed if placement requires it. If placed directly into MATH 7, take ENGL C1001 here and pull the calculus sequence forward by one term."
        }
      ]
    },
    {
      id: "spring-2027",
      name: "Spring 2027",
      start: "2027-02-16",
      end: "2027-06-16",
      status: "planned",
      courses: [
        {
          id: "math-7",
          code: "MATH 7",
          title: "Calculus 1",
          units: 5,
          category: "Major prep",
          transferable: true,
          defaultDone: false,
          defaultGrade: "",
          areas: ["2"],
          preferredArea: "2"
        },
        {
          id: "acctg-2",
          code: "ACCTG 2",
          title: "Managerial Accounting",
          units: 5,
          category: "Major prep",
          transferable: true,
          defaultDone: false,
          defaultGrade: "",
          areas: []
        },
        {
          id: "econ-c2002",
          code: "ECON C2002",
          title: "Principles of Macroeconomics",
          units: 3,
          category: "Major prep",
          transferable: true,
          defaultDone: false,
          defaultGrade: "",
          areas: ["4"],
          discipline: "Economics",
          note: "Required major prep. It cannot serve as the second Area 4 discipline alongside ECON C2001."
        }
      ]
    },
    {
      id: "summer-2027",
      name: "Summer 2027",
      start: "2027-06-21",
      end: "2027-08-06",
      status: "planned",
      courses: [
        {
          id: "engl-c1001",
          code: "ENGL C1001",
          title: "Critical Thinking and Composition",
          units: 3,
          category: "Requirement",
          transferable: true,
          defaultDone: false,
          defaultGrade: "",
          areas: ["1B", "3B"],
          preferredArea: "1B",
          note: "Second English course required for UC admission. Use it for Area 1B, not both 1B and 3B."
        },
        {
          id: "comm-c1000",
          code: "COMM C1000",
          title: "Public Speaking",
          units: 3,
          category: "GE",
          transferable: true,
          defaultDone: false,
          defaultGrade: "",
          areas: ["1C"],
          preferredArea: "1C"
        }
      ]
    },
    {
      id: "fall-2027",
      name: "Fall 2027",
      start: "2027-08-30",
      end: "2027-12-21",
      status: "planned",
      note: "Application term. Admissions officers read these courses as in progress.",
      courses: [
        {
          id: "math-8",
          code: "MATH 8",
          title: "Calculus 2",
          units: 5,
          category: "Major prep",
          transferable: true,
          defaultDone: false,
          defaultGrade: "",
          areas: []
        },
        {
          id: "stat-c1000",
          code: "STAT C1000",
          title: "Introduction to Statistics",
          units: 4,
          category: "Major prep",
          transferable: true,
          defaultDone: false,
          defaultGrade: "",
          areas: []
        },
        {
          id: "eth-st-1",
          code: "ETH ST 1",
          title: "Introduction to Ethnic Studies",
          units: 3,
          category: "GE",
          transferable: true,
          defaultDone: false,
          defaultGrade: "",
          areas: ["6", "4"],
          preferredArea: "6",
          discipline: "Ethnic Studies",
          note: "Use for Area 6. A single course cannot also be certified in Area 4."
        },
        {
          id: "media-1",
          code: "MEDIA 1",
          title: "Survey of Mass Media Communications",
          units: 3,
          category: "GE",
          transferable: true,
          defaultDone: false,
          defaultGrade: "",
          areas: ["4"],
          preferredArea: "4",
          discipline: "Media Studies",
          note: "Second Area 4 discipline alongside one economics course. Confirm approval for the catalog year taken."
        }
      ]
    },
    {
      id: "winter-2028",
      name: "Winter 2028",
      start: "2028-01-04",
      end: "2028-02-10",
      status: "planned",
      courses: [
        {
          id: "hist-12",
          code: "HIST 12",
          title: "US History since 1877",
          units: 3,
          category: "GE",
          transferable: true,
          defaultDone: false,
          defaultGrade: "",
          areas: ["3B"],
          preferredArea: "3B"
        }
      ]
    },
    {
      id: "spring-2028",
      name: "Spring 2028",
      start: "2028-02-14",
      end: "2028-06-13",
      status: "planned",
      note: "Last-chance term. Full Cal-GETC and 60 transferable units must be complete by the end.",
      courses: [
        {
          id: "astron-1",
          code: "ASTRON 1",
          title: "Stellar Astronomy",
          units: 3,
          category: "GE",
          transferable: true,
          defaultDone: false,
          defaultGrade: "",
          areas: ["5A"],
          preferredArea: "5A"
        },
        {
          id: "biol-3",
          code: "BIOL 3",
          title: "Fundamentals of Biology",
          units: 4,
          category: "GE",
          transferable: true,
          defaultDone: false,
          defaultGrade: "",
          areas: ["5B", "5C"],
          preferredArea: "5B",
          labPair: true,
          note: "Lecture with lab. This course closes the biological science and lab requirements together."
        }
      ]
    }
  ],

  decisions: [
    {
      id: "math-placement",
      due: "2026-10-15",
      title: "Math placement: MATH 7 or MATH 2 first?",
      detail: "This is the highest-leverage fall decision. Take the placement assessment and confirm the prerequisite with a counselor.",
      options: ["Placed into MATH 7", "Need MATH 2 first"]
    },
    {
      id: "scholars-tap",
      due: "2026-12-15",
      title: "Apply to SMC Scholars Program for UCLA TAP?",
      detail: "The official Winter/Spring 2027 application window was listed as October 12 through December 15, 2026 at the August 2026 review. Apply early and recheck the official page before filing.",
      options: ["Applying", "Skipping"]
    },
    {
      id: "tag-major",
      due: "2027-09-01",
      title: "TAG major: Business Economics or Business Administration?",
      detail: "UCI Business Administration is not TAG-eligible. The TAG major must match the major on the main UC application.",
      options: ["Business Economics (TAG · confirm 2027–28)", "Business Administration (no TAG)"]
    }
  ],

  milestones: [
    { date: "2026-09-07", title: "Labor Day", category: "No class", noClass: true },
    { date: "2026-09-13", title: "Fall refund deadline", category: "SMC", hardDeadline: true },
    { date: "2026-09-27", title: "Last day to drop without a W", category: "SMC", hardDeadline: true, detail: "A W is survivable; two becomes a pattern. This is the clean exit." },
    { date: "2026-10-15", title: "Resolve math placement", category: "Decision", hardDeadline: true },
    { date: "2026-11-11", title: "Veterans Day", category: "No class", noClass: true },
    { date: "2026-11-22", title: "Last day to drop with a W", category: "SMC", hardDeadline: true },
    { date: "2026-11-26", endDate: "2026-11-28", title: "Thanksgiving break", category: "No class", noClass: true },
    { date: "2026-12-15", title: "SMC Scholars Winter/Spring 2027 application closes", category: "Decision", hardDeadline: true, verify: true, detail: "Official page listed an October 12–December 15, 2026 window at the August 2026 review. Apply early and recheck before filing." },
    { date: "2026-12-15", title: "Fall finals begin", category: "SMC" },
    { date: "2026-12-22", title: "Fall term ends and P/NP deadline", category: "SMC", detail: "ENGL C1000's P/NP option closes December 21." },

    { date: "2027-01-04", title: "Winter session starts", category: "SMC" },
    { date: "2027-01-18", title: "MLK Day", category: "No class", noClass: true },
    { date: "2027-02-11", title: "Winter session ends", category: "SMC" },
    { date: "2027-02-12", title: "Lincoln's Day", category: "No class", noClass: true },
    { date: "2027-02-15", title: "Presidents' Day", category: "No class", noClass: true },
    { date: "2027-02-16", title: "Spring 2027 classes start", category: "SMC" },
    { date: "2027-04-12", endDate: "2027-04-17", title: "Spring break", category: "No class", noClass: true },
    { date: "2027-05-31", title: "Memorial Day", category: "No class", noClass: true },
    { date: "2027-06-08", title: "Spring finals begin", category: "SMC", detail: "Finals run through June 16." },
    { date: "2027-06-21", title: "Summer 2027 starts", category: "SMC" },
    { date: "2027-08-01", title: "UC application opens", category: "Apply", detail: "Open the account and start the activities section early." },
    { date: "2027-08-30", title: "Fall 2027 classes start", category: "SMC" },
    { date: "2027-09-01", title: "UC TAG application window opens", category: "Apply", hardDeadline: true, verify: true, detail: "Expected through September 30. UCI participates; UCLA does not. Confirm the 2027–28 matrix." },
    { date: "2027-09-06", title: "Labor Day", category: "No class", noClass: true },
    { date: "2027-09-30", title: "UC TAG deadline", category: "Apply", hardDeadline: true, verify: true },
    { date: "2027-10-01", title: "UC submission and FAFSA open", category: "Apply" },
    { date: "2027-11-11", title: "Veterans Day", category: "No class", noClass: true },
    { date: "2027-11-25", endDate: "2027-11-27", title: "Thanksgiving break", category: "No class", noClass: true },
    { date: "2027-11-30", title: "UC application deadline", category: "Apply", hardDeadline: true, detail: "Do not plan around an extension. Submit by mid-November." },
    { date: "2027-12-14", title: "Fall 2027 finals begin", category: "SMC", detail: "Finals run through December 21." },
    { date: "2027-12-23", endDate: "2028-01-01", title: "Winter break", category: "No class", noClass: true },

    { date: "2028-01-04", title: "Winter 2028 starts", category: "SMC" },
    { date: "2028-01-17", title: "MLK Day", category: "No class", noClass: true },
    { date: "2028-01-31", title: "UC Transfer Academic Update due", category: "Apply", hardDeadline: true, detail: "Report fall grades and confirm spring courses. Missing this can void the application." },
    { date: "2028-02-01", title: "USC transfer application deadline", category: "Apply", hardDeadline: true, verify: true },
    { date: "2028-02-11", title: "Lincoln's Day", category: "No class", noClass: true },
    { date: "2028-02-14", title: "Spring 2028 classes start", category: "SMC" },
    { date: "2028-02-21", title: "Presidents' Day", category: "No class", noClass: true },
    { date: "2028-03-02", title: "FAFSA / Cal Grant priority deadline", category: "Apply", hardDeadline: true, verify: true },
    { date: "2028-03-15", title: "USC supplemental transfer materials due", category: "Apply", hardDeadline: true, verify: true, detail: "Confirm the exact supplemental-document date on USC's admission site." },
    { date: "2028-04-10", endDate: "2028-04-15", title: "Spring break", category: "No class", noClass: true },
    { date: "2028-04-30", title: "UC decisions expected", category: "Apply", verify: true },
    { date: "2028-05-29", title: "Memorial Day", category: "No class", noClass: true },
    { date: "2028-06-01", title: "Statement of Intent to Register due", category: "Apply", hardDeadline: true, verify: true },
    { date: "2028-06-06", title: "Spring finals begin", category: "SMC", detail: "Finals run through June 13." },
    { date: "2028-06-13", title: "Spring term ends; 60 units and Cal-GETC due", category: "Apply", hardDeadline: true, detail: "SMC graduation. Full requirements must be complete as of this date." },
    { date: "2028-07-01", title: "Request Cal-GETC certification and send transcripts", category: "Apply", hardDeadline: true, detail: "Certification is not automatic. Petition for it." }
  ],

  geTiers: [
    {
      tier: "S",
      title: "Take these",
      entries: [
        { code: "ENGL C1001", title: "Critical Thinking and Composition", units: 3, area: "1B", why: "The second English course UC requires for admission. Nothing substitutes for it.", watch: "It can appear under 3B, but one course cannot be certified in both areas." },
        { code: "COMM C1000", title: "Public Speaking", units: 3, area: "1C", why: "Closes Area 1C and directly improves client calls and pitching.", watch: "Live presentations. Prefer a full term over a compressed winter session." },
        { code: "ETH ST 1", title: "Introduction to Ethnic Studies", units: 3, area: "6", why: "One 3-unit course closes an entire required area.", watch: "Use it for Area 6, not Area 4 at the same time." },
        { code: "MEDIA 1", title: "Survey of Mass Media Communications", units: 3, area: "4", why: "Supplies the second Area 4 discipline and connects to Bobby's existing work.", watch: "Confirm current Cal-GETC Area 4 approval for the catalog year taken." }
      ]
    },
    {
      tier: "A",
      title: "Good value, slightly heavier",
      entries: [
        { code: "BIOL 3", title: "Fundamentals of Biology", units: 4, area: "5B + 5C", why: "Lecture and lab in one course closes biological science and lab together.", watch: "Do not stack it in the same term as Calculus 2." },
        { code: "ASTRON 1", title: "Stellar Astronomy", units: 3, area: "5A", why: "Lecture-only physical science with no lab or math-prerequisite burden.", watch: "Works only when the lab requirement is satisfied on the biological-science side." },
        { code: "HIST 12", title: "US History since 1877", units: 3, area: "3B", why: "Closes humanities and can also support CSU American Institutions planning.", watch: "Heavier reading and writing than a philosophy survey." },
        { code: "GEOL 1", title: "Physical Geology", units: 3, area: "5A", why: "A schedule substitute for ASTRON 1.", watch: "The lab is separate. GEOL 1 alone does not close Area 5C." }
      ]
    },
    {
      tier: "B",
      title: "Fine substitutes",
      entries: [
        { code: "PHILOS 1, 2, or 5", title: "Philosophy survey", units: 3, area: "3B", why: "A lighter humanities alternative with useful argument practice.", watch: "Essay grading varies by instructor. Check grade distributions." },
        { code: "PSYC C1000", title: "General Psychology", units: 3, area: "4", why: "A valid second Area 4 discipline when MEDIA 1 is unavailable.", watch: "Large lecture and memorization load. Use only if needed." },
        { code: "SOCIOL 1", title: "Introduction to Sociology", units: 3, area: "4", why: "Widely offered and valid as a different Area 4 discipline from economics.", watch: "Pick it for availability, not added major value." },
        { code: "PSYCH 2", title: "Physiological Psychology", units: 3, area: "5B", why: "Can close biological science without a lab.", watch: "A separate lab still remains, usually increasing total work." }
      ]
    },
    {
      tier: "C",
      title: "Only if nothing else fits",
      entries: [
        { code: "COM ST 21", title: "Argumentation", units: 3, area: "1C", why: "A backup when COMM C1000 is full.", watch: "Heavier workload for the same single area." },
        { code: "AHIS 18", title: "Art history humanities course", units: 3, area: "3B", why: "Works for the humanities slot and builds on AHIS 11 familiarity.", watch: "Two art-history courses can read as filler on a business-focused plan." }
      ]
    },
    {
      tier: "D",
      title: "Avoid",
      entries: [
        { code: "ECON C2002", title: "Macroeconomics as the second Area 4 course", units: 3, area: "4", why: "Take it for required major prep, not as a second Area 4 discipline.", watch: "It shares the economics discipline with ECON C2001, so the pair does not complete Area 4." },
        { code: "MATH 28", title: "Calculus for Business", units: 5, area: "2", why: "No strategic value for this exact transfer path.", watch: "The target business-economics programs require the MATH 7/MATH 8 sequence." },
        { code: "CHEM 10/11 or PHYSCS 6+", title: "STEM-track lab science", units: 5, area: "5A", why: "Closes an area that a 3-unit lecture course can close.", watch: "Four to five units plus lab creates the worst hours-per-unit tradeoff here." },
        { code: "ANATMY 1, MCRBIO 1, or ZOOL 5", title: "Health-track lab science", units: 5, area: "5B + 5C", why: "Can close both science requirements.", watch: "Built for pre-health students and carries a heavy lab load." },
        { code: "Language levels 2–4", title: "Language sequence", units: 5, area: "3B", why: "Eventually fills humanities.", watch: "Five units per course; the UC language rule is generally a graduation issue, not this transfer-admission plan." },
        { code: "1-unit activity electives", title: "PE, ensemble, or studio unit", units: 1, area: "None", why: "Barely moves the unit total.", watch: "Cal-GETC courses must be at least 3 units, so these close no area." }
      ]
    }
  ],

  campuses: [
    {
      id: "uci",
      campus: "UC Irvine",
      program: "Business Economics or Business Administration",
      requirements: ["MATH 7", "MATH 8", "ECON C2001", "ECON C2002", "STAT C1000", "ACCTG 1", "ACCTG 2"],
      context: "Business Administration is selective and is not TAG-eligible. Business Economics is the possible TAG route, subject to the current matrix.",
      selectivityMajor: "Business Economics / Business Administration"
    },
    {
      id: "ucla",
      campus: "UCLA",
      program: "Business Economics or Economics",
      requirements: ["MATH 7", "MATH 8", "ECON C2001", "ECON C2002", "ACCTG 1", "ACCTG 2"],
      context: "UCLA has no TAG. Finish major prep as early as possible; TAP through SMC Scholars is priority consideration, not a guarantee.",
      selectivityMajor: "Business Economics / Economics"
    },
    {
      id: "usc",
      campus: "USC",
      program: "Marshall School — Business Administration",
      requirements: ["MATH 7", "ECON C2001", "ECON C2002", "ACCTG 1", "ACCTG 2", "ENGL C1000", "ENGL C1001"],
      context: "USC uses its own transfer-credit and application rules. Spring grades may still be reviewed.",
      selectivityMajor: "Marshall Business Administration"
    }
  ],

  safetyLadder: [
    "UCI TAG route, if the selected major remains eligible and every condition is met.",
    "UCLA TAP route through SMC Scholars, if every program requirement is completed.",
    "Regular applications to UCI, UCLA, and USC.",
    "At least two additional UC, CSU, or private-school backups Bobby would genuinely attend, chosen with a counselor after checking major access, cost, and articulation.",
    "SMC Transfer Center events, university-representative appointments, college fairs, and any on-the-spot admission event offered that year. EVENT-DEPENDENT."
  ],

  rejectionWorkflow: [
    "Read the decision and check whether all reported courses, grades, and updates were evaluated correctly.",
    "Appeal only if the campus permits it and there is an evaluation error or genuinely new, compelling information. Disappointment alone is not an appeal reason.",
    "Activate admitted backup schools and compare financial aid, access to the intended major, and possible transfer-credit loss.",
    "Meet an SMC transfer counselor within seven days to review late, spring, winter, summer, or next-cycle options.",
    "Keep the completed record. A denial does not erase transferable units, major preparation, Cal-GETC progress, or the ability to apply elsewhere."
  ],

  playbook: [
    {
      id: "grades",
      title: "Grades",
      items: [
        "Transferable GPA matters, and prerequisite GPA can matter even more for selective majors.",
        "Aim for the highest GPA possible. A Reddit poster's 4.0 is a strong result, not a universal minimum or admission guarantee.",
        "Finish as much required major preparation as possible by the fall term in which you apply. Do not casually leave a key prerequisite for final spring.",
        "Check ASSIST before registration, not after a course is finished.",
        "Use the SMC grade distribution report and Rate My Professors together. Grade data is one signal; reviews are another.",
        "Treat reviews as pattern detection, not truth. One angry review proves nothing; a repeated specific complaint deserves attention.",
        "Protect grades before adding another club, title, or application activity.",
        "One C is recoverable arithmetic, not a moral judgment. Use the GPA engine to see the exact recovery path."
      ]
    },
    {
      id: "counseling",
      title: "Counseling",
      items: [
        "Meet an SMC counselor before every registration window and at least every three to four weeks during active terms.",
        "Go early in the cycle instead of waiting until registration and application deadlines make appointments scarce.",
        "Repeated visits compound. Once a counselor knows the major and target campuses, the advice becomes more specific.",
        "Bring the current ASSIST agreement, Cal-GETC worksheet, and transcript. Ask the counselor to confirm the plan against all three.",
        "Ask directly about Scholars, TAP, TAG, UCLA CCCP, priority registration, scholarships, university-representative visits, transfer fairs, and on-the-spot admission events.",
        "Record the counselor's name, visit date, advice, and every item that still needs verification."
      ]
    },
    {
      id: "cal-getc",
      title: "Cal-GETC",
      items: [
        "Use Cal-GETC, not older IGETC advice, because you began at a California community college after Fall 2025.",
        "Track Cal-GETC and major preparation separately. Overlap is useful but never assumed.",
        "A course listed in two areas can be certified in only one, except the defined science lecture-and-lab pairing.",
        "Area 4 requires two courses from different discipline groups. Microeconomics and macroeconomics do not form a valid pair.",
        "Every Cal-GETC course needs at least 3 semester units and a grade of C or better.",
        "Do not let a GE choice push required major prep into final spring.",
        "Certification must be requested. Graduation does not trigger it automatically.",
        "Recheck the exact catalog year and target-campus rules before every registration period."
      ]
    },
    {
      id: "programs-odds",
      title: "Programs and odds",
      items: [
        "Use official UC Transfer by Major data to judge selectivity by campus and major. Campus-wide rates are not major-level odds.",
        "UCI TAG is the strongest safety only when the exact major remains eligible and every condition is met through enrollment.",
        "UCLA TAP is priority consideration, not guaranteed admission.",
        "UCLA CCCP provides preparation and support. It is not TAP and not an admission promise.",
        "Apply beyond the dream schools. A backup is real only if you would attend it and can afford it.",
        "Use SMC college fairs and university-representative visits to confirm requirements and identify additional campuses.",
        "On-the-spot admission events are legitimate but limited to the schools participating in that year's event."
      ]
    },
    {
      id: "extracurriculars",
      title: "Extracurriculars",
      items: [
        "Do not pad the UC application to fill every activity slot. A shorter honest list is stronger than filler.",
        "Depth over count. One or two sustained commitments with measurable work beat many brief memberships.",
        "A paid job counts. Running a business counts. Family responsibilities can provide important context.",
        "Quantify impact honestly: managed 6 client accounts and grew one from 2,000 to 40,000 followers, only when those numbers are accurate.",
        "Connect activities to the application story. The activity description is the headline; a PIQ can show the decision, action, result, and change.",
        "Prioritize work completed during community college. Do not build the strategy around old high-school awards.",
        "A board role in one or two real clubs can add depth. Do not chase a title with no work behind it."
      ]
    },
    {
      id: "piqs",
      title: "PIQs",
      items: [
        "Show, do not merely tell. Replace character claims with a specific action and result.",
        "Use plain language and active voice.",
        "Do not waste the opening on philosophy, a long setup, forced humor, or thesaurus wording.",
        "Write about yourself. Other people appear only when they reveal a choice you made or an action you took.",
        "Build the activities list first, then select PIQ stories that add depth instead of repeating it.",
        "If your business is the strongest unusual experience, show the problem, action, measurable impact, and what changed.",
        "Use numbers when they clarify scale, but never invent or inflate them.",
        "Avoid repeating the same lesson or trait across several PIQs.",
        "Proofread on separate days and have at least one human reader test whether every paragraph is clear."
      ]
    },
    {
      id: "reality-checks",
      title: "Reality checks",
      items: [
        "SMC students do transfer to selective universities. Individual success stories prove possibility, not probability.",
        "Junior-transfer review centers on the college record and full transfer application, especially transferable grades and major preparation.",
        "Keep prior school and examination records because an admitted campus may request them for verification.",
        "UC minimum requirements establish eligibility, not competitiveness for a selective campus or major.",
        "SMC is not a magical feeder. It supplies articulation, counseling, programs, and a large transfer ecosystem; you still execute the plan.",
        "The community-college unit cap is not permission to take random courses. Extra courses can waste time or lower the GPA.",
        "Winter and summer move quickly. Use them strategically rather than automatically placing calculus, accounting, or lab science there.",
        "A rejection does not mean community college failed. Review for errors, use admitted backups, and keep every valid course completed.",
        "This remains a business and business-economics transfer plan. Do not add premed requirements to it."
      ]
    }
  ],

  resources: [
    { label: "ASSIST", url: "https://assist.org/" },
    { label: "UC transfer basic requirements", url: "https://admission.universityofcalifornia.edu/admission-requirements/transfer-requirements/" },
    { label: "UC Transfer by Major", url: "https://www.universityofcalifornia.edu/about-us/information-center/transfers-major" },
    { label: "Current UC TAG rules and matrix", url: "https://admission.universityofcalifornia.edu/admission-requirements/transfer-requirements/uc-transfer-programs/transfer-admission-guarantee-tag.html" },
    { label: "SMC Scholars and UCLA TAP", url: "https://www.smc.edu/student-support/academic-support/counseling/special-support-programs/scholars/" },
    { label: "UCLA transfer and CCCP", url: "https://admission.ucla.edu/apply/transfer" },
    { label: "SMC Transfer Center", url: "https://www.smc.edu/student-support/academic-support/transfer-center/" },
    { label: "SMC college fair", url: "https://www.smc.edu/student-support/academic-support/transfer-center/college-fair/" },
    { label: "Schools visiting SMC", url: "https://www.smc.edu/student-support/academic-support/transfer-center/resources/schools-visiting-smc.php" },
    { label: "SMC on-the-spot admission · event-dependent", url: "https://www.smc.edu/student-support/academic-support/transfer-center/on-the-spot-admission-day.php" }
  ]
});
