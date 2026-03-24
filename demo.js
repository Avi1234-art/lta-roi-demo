/* ———————————————————————————————————————————————————
   Guided Demo — Persana ROI Calculator
   Spotlight engine + company picker + 8-step tour
   ——————————————————————————————————————————————————— */

(function () {
    "use strict";

    /* ——— Company data for the picker ——— */
    const DEMO_COMPANIES = [
        {
            key: "google",
            name: "Google",
            domain: "google.com",
            employees: 182502,
            revenue: 307400000000,
            tooling: 912000,
            salesVolume: 6480000,
            blurb: "the world's largest search & cloud platform",
            logoUrl: "https://logo.clearbit.com/google.com"
        },
        {
            key: "tesla",
            name: "Tesla",
            domain: "tesla.com",
            employees: 140473,
            revenue: 96773000000,
            tooling: 702000,
            salesVolume: 6480000,
            blurb: "the leading electric vehicle manufacturer",
            logoUrl: "https://logo.clearbit.com/tesla.com"
        },
        {
            key: "microsoft",
            name: "Microsoft",
            domain: "microsoft.com",
            employees: 221000,
            revenue: 245000000000,
            tooling: 1105000,
            salesVolume: 8200000,
            blurb: "the world's largest software company",
            logoUrl: "https://logo.clearbit.com/microsoft.com"
        },
        {
            key: "salesforce",
            name: "Salesforce",
            domain: "salesforce.com",
            employees: 72682,
            revenue: 34860000000,
            tooling: 363000,
            salesVolume: 5200000,
            blurb: "the #1 CRM platform globally",
            logoUrl: "https://logo.clearbit.com/salesforce.com"
        },
        {
            key: "hubspot",
            name: "HubSpot",
            domain: "hubspot.com",
            employees: 8400,
            revenue: 2200000000,
            tooling: 90000,
            salesVolume: 2500000,
            blurb: "the leading inbound marketing & sales platform",
            logoUrl: "https://logo.clearbit.com/hubspot.com"
        },
        {
            key: "adobe",
            name: "Adobe",
            domain: "adobe.com",
            employees: 29800,
            revenue: 21500000000,
            tooling: 149000,
            salesVolume: 4500000,
            blurb: "the creative & document cloud leader",
            logoUrl: "https://logo.clearbit.com/adobe.com"
        }
    ];

    /* ——— Utility helpers ——— */
    function fmt(n) {
        if (n >= 1e9) return "$" + (n / 1e9).toFixed(1) + "B";
        if (n >= 1e6) return "$" + (n / 1e6).toFixed(1) + "M";
        if (n >= 1e3) return "$" + (n / 1e3).toFixed(0) + "K";
        return "$" + n.toLocaleString();
    }

    function fmtPct(el) {
        return el ? el.textContent.trim() : "0%";
    }

    function fmtVal(el) {
        return el ? el.textContent.trim() : "$0";
    }

    function scrollTo(el) {
        el.scrollIntoView({ behavior: "smooth", block: "center" });
    }

    /* ——— Step builder (returns array of steps for a given company) ——— */
    function buildSteps(co) {
        return [
            {
                target: "#lookupMeta",
                title: `Meet ${co.name}`,
                text: `${co.name} is ${co.blurb} with ${co.employees.toLocaleString()} employees and ${fmt(co.revenue)} in annual revenue. Persana uses this real-world data to tailor your ROI projections.`
            },
            {
                target: "#coreInputsPanel",
                title: "Company Metrics",
                text: `With ${co.employees.toLocaleString()} employees, ${co.name}'s estimated tooling spend is ${fmt(co.tooling)}/year and sales pipeline volume is ${fmt(co.salesVolume)}. These numbers drive cost savings and revenue lift calculations.`
            },
            {
                target: ".scenario-switch",
                title: "Choose a Scenario",
                text: `Compare Low, Base, and High outcomes for ${co.name}. Each scenario adjusts assumptions like hours saved per rep, conversion lift, and tool consolidation — so you can see conservative through optimistic projections.`
            },
            {
                target: "#kpiRoiPct",
                title: "Return on Investment",
                textFn: () => {
                    const roi = fmtPct(document.getElementById("kpiRoiPct"));
                    return `Under the current scenario, ${co.name} could see a ${roi} ROI with Persana. That means every dollar invested in the platform generates significant returns across time savings, tool consolidation, and revenue uplift.`;
                }
            },
            {
                target: "#kpiPaybackMonths",
                title: "Payback Period",
                textFn: () => {
                    const months = fmtVal(document.getElementById("kpiPaybackMonths"));
                    return `${co.name} would recoup its entire Persana investment in just ${months} under this scenario. The faster the payback, the lower the risk.`;
                }
            },
            {
                target: ".breakdown-grid",
                title: "Benefit Breakdown",
                textFn: () => {
                    const total = fmtVal(document.getElementById("kpiTotalBenefit"));
                    return `Time savings, tool consolidation, and revenue lift combine for ${total} in estimated annual benefit for ${co.name}. Hover over each card to see the exact formula used.`;
                }
            },
            {
                target: ".charts-section",
                title: "Visual Comparison",
                text: `These charts compare ${co.name}'s ROI, benefit breakdown, and payback period across all three scenarios — giving you a clear picture of the range of possible outcomes.`
            },
            {
                target: ".calc-footer",
                title: "Ready to Get Started?",
                text: `That's the full picture for ${co.name}! Now try it with your own company data, or visit persana.ai to learn how Persana can transform your sales workflow.`,
                isFinal: true
            }
        ];
    }

    /* ——— DOM creation ——— */
    function createPickerOverlay() {
        const overlay = document.createElement("div");
        overlay.id = "demoPickerOverlay";
        overlay.className = "demo-picker";
        overlay.innerHTML = `
      <div class="demo-picker-inner">
        <h2 class="demo-picker-title">Choose a Company</h2>
        <p class="demo-picker-sub">Select a company to see a personalized walkthrough of the ROI calculator</p>
        <div class="demo-picker-grid" id="demoPickerGrid"></div>
        <button class="demo-picker-cancel" id="demoPickerCancel">Cancel</button>
      </div>
    `;
        document.body.appendChild(overlay);

        const grid = overlay.querySelector("#demoPickerGrid");
        DEMO_COMPANIES.forEach((co) => {
            const card = document.createElement("button");
            card.className = "demo-picker-card";
            card.dataset.company = co.key;
            card.innerHTML = `
        <img class="demo-picker-logo" src="${co.logoUrl}" alt="${co.name}"
             onerror="this.src='https://www.google.com/s2/favicons?domain=${co.domain}&sz=128'" />
        <span class="demo-picker-name">${co.name}</span>
      `;
            grid.appendChild(card);
        });

        return overlay;
    }

    function createSpotlightUI() {
        /* Dark overlay with a hole */
        const overlay = document.createElement("div");
        overlay.id = "demoOverlay";
        overlay.className = "demo-overlay";

        /* Pulsing dot */
        const dot = document.createElement("div");
        dot.id = "demoDot";
        dot.className = "demo-dot";

        /* Tooltip */
        const tooltip = document.createElement("div");
        tooltip.id = "demoTooltip";
        tooltip.className = "demo-tooltip";
        tooltip.innerHTML = `
      <div class="demo-tooltip-header">
        <span class="demo-tooltip-step" id="demoStepCounter">Step 1/8</span>
        <button class="demo-tooltip-skip" id="demoSkip">Skip Demo</button>
      </div>
      <h3 class="demo-tooltip-title" id="demoTitle"></h3>
      <p class="demo-tooltip-text" id="demoText"></p>
      <div class="demo-tooltip-nav">
        <button class="demo-tooltip-btn" id="demoPrev">← Back</button>
        <button class="demo-tooltip-btn demo-tooltip-btn--primary" id="demoNext">Next →</button>
      </div>
    `;

        document.body.appendChild(overlay);
        document.body.appendChild(dot);
        document.body.appendChild(tooltip);

        return { overlay, dot, tooltip };
    }

    /* ——— Spotlight positioning ——— */
    function positionSpotlight(targetEl, dot, tooltip, overlay) {
        const rect = targetEl.getBoundingClientRect();
        const pad = 12;
        const sx = rect.left - pad + window.scrollX;
        const sy = rect.top - pad + window.scrollY;
        const sw = rect.width + pad * 2;
        const sh = rect.height + pad * 2;

        /* Cut a hole in the overlay using clip-path */
        const vw = document.documentElement.scrollWidth;
        const vh = document.documentElement.scrollHeight;
        overlay.style.clipPath = `polygon(
      0 0, ${vw}px 0, ${vw}px ${vh}px, 0 ${vh}px, 0 0,
      ${sx}px ${sy}px, ${sx}px ${sy + sh}px, ${sx + sw}px ${sy + sh}px, ${sx + sw}px ${sy}px, ${sx}px ${sy}px
    )`;

        /* Position dot at top-right of the target */
        dot.style.left = `${rect.right + window.scrollX + 4}px`;
        dot.style.top = `${rect.top + window.scrollY - 4}px`;

        /* Position tooltip below or above the target */
        const tooltipWidth = 380;
        let tLeft = rect.left + window.scrollX + (rect.width - tooltipWidth) / 2;
        tLeft = Math.max(16, Math.min(tLeft, window.innerWidth - tooltipWidth - 16));

        const spaceBelow = window.innerHeight - rect.bottom;
        let tTop;
        if (spaceBelow > 220) {
            tTop = rect.bottom + window.scrollY + 20;
        } else {
            tTop = rect.top + window.scrollY - 220;
        }
        tTop = Math.max(window.scrollY + 16, tTop);

        tooltip.style.left = `${tLeft}px`;
        tooltip.style.top = `${tTop}px`;
        tooltip.style.width = `${tooltipWidth}px`;
    }

    /* ——— Auto-play settings ——— */
    const AUTOPLAY_STEP_DELAY = 6000; /* ms each step stays visible */

    /* ——— Demo controller ——— */
    function startDemo(companyKey, autoPlay) {
        const co = DEMO_COMPANIES.find((c) => c.key === companyKey);
        if (!co) return;

        /* Load company data into the calculator */
        if (typeof window.applyLookupResult === "function") {
            window.applyLookupResult({
                companyName: co.name,
                employeeEstimate: co.employees,
                revenueEstimateUsd: co.revenue,
                logoUrl: co.logoUrl,
                confidence: 0.9,
                sources: [
                    { label: `Wikipedia: ${co.name}`, url: `https://en.wikipedia.org/wiki/${co.name}`, field: "company" }
                ],
                usedMock: false
            });
        }

        /* Small delay to let calculator recalculate */
        setTimeout(() => {
            const steps = buildSteps(co);
            let currentStep = 0;
            let isTransitioning = false;
            let prevHighlight = null;
            let autoPlayTimer = null;

            const { overlay, dot, tooltip } = createSpotlightUI();
            const titleEl = document.getElementById("demoTitle");
            const textEl = document.getElementById("demoText");
            const stepCounter = document.getElementById("demoStepCounter");
            const prevBtn = document.getElementById("demoPrev");
            const nextBtn = document.getElementById("demoNext");
            const skipBtn = document.getElementById("demoSkip");

            function removeHighlight() {
                if (prevHighlight) {
                    prevHighlight.classList.remove("demo-highlight");
                    prevHighlight = null;
                }
            }

            function scheduleAutoAdvance() {
                if (!autoPlay) return;
                clearTimeout(autoPlayTimer);
                autoPlayTimer = setTimeout(() => {
                    if (currentStep >= steps.length - 1) {
                        endDemo();
                    } else {
                        showStep(currentStep + 1, false);
                    }
                }, AUTOPLAY_STEP_DELAY);
            }

            function showStep(index, isFirst) {
                if (isTransitioning) return;
                isTransitioning = true;
                clearTimeout(autoPlayTimer);

                const step = steps[index];
                const targetEl = document.querySelector(step.target);

                if (!targetEl) {
                    isTransitioning = false;
                    if (index < steps.length - 1) showStep(index + 1, isFirst);
                    return;
                }

                /* For KPI values, target the parent card */
                let spotlightTarget = targetEl;
                if (targetEl.classList.contains("kpi-value")) {
                    spotlightTarget = targetEl.closest(".kpi-card") || targetEl;
                }

                /* Phase 1: Fade out tooltip (skip on first step) */
                if (!isFirst) {
                    tooltip.classList.remove("is-active");
                    dot.classList.remove("is-active");
                }
                removeHighlight();

                const fadeOutDuration = isFirst ? 0 : 300;

                setTimeout(() => {
                    currentStep = index;

                    /* Scroll into view */
                    scrollTo(spotlightTarget);

                    /* Phase 2: After scroll settles, update content and fade in */
                    setTimeout(() => {
                        titleEl.textContent = step.title;
                        textEl.textContent = step.textFn ? step.textFn() : step.text;
                        stepCounter.textContent = `Step ${index + 1}/${steps.length}`;
                        prevBtn.style.display = index === 0 ? "none" : "";
                        nextBtn.textContent = step.isFinal ? "Finish ✓" : "Next →";

                        /* Add highlight glow to target */
                        spotlightTarget.classList.add("demo-highlight");
                        prevHighlight = spotlightTarget;

                        /* Position and reveal */
                        overlay.classList.add("is-active");
                        positionSpotlight(spotlightTarget, dot, tooltip, overlay);

                        /* Slight delay before showing tooltip for a staggered feel */
                        setTimeout(() => {
                            dot.classList.add("is-active");
                            tooltip.classList.add("is-active");
                            isTransitioning = false;
                            scheduleAutoAdvance();
                        }, 150);
                    }, 450);
                }, fadeOutDuration);
            }

            function endDemo() {
                clearTimeout(autoPlayTimer);
                removeHighlight();
                overlay.classList.remove("is-active");
                dot.classList.remove("is-active");
                tooltip.classList.remove("is-active");
                overlay.style.clipPath = "";

                setTimeout(() => {
                    overlay.remove();
                    dot.remove();
                    tooltip.remove();
                }, 300);

                /* Clean URL */
                const url = new URL(window.location);
                url.searchParams.delete("demo");
                url.searchParams.delete("company");
                url.searchParams.delete("record");
                window.history.replaceState({}, "", url.toString());

                /* If recording, stop it */
                if (window._demoRecorder && window._demoRecorder.state === "recording") {
                    window._demoRecorder.stop();
                }
            }

            nextBtn.addEventListener("click", () => {
                if (currentStep >= steps.length - 1) {
                    endDemo();
                } else {
                    showStep(currentStep + 1, false);
                }
            });

            prevBtn.addEventListener("click", () => {
                if (currentStep > 0) showStep(currentStep - 1, false);
            });

            skipBtn.addEventListener("click", endDemo);
            overlay.addEventListener("click", (e) => {
                if (e.target === overlay) endDemo();
            });

            /* Handle window resize */
            let resizeTimer;
            window.addEventListener("resize", () => {
                clearTimeout(resizeTimer);
                resizeTimer = setTimeout(() => {
                    const step = steps[currentStep];
                    const targetEl = document.querySelector(step.target);
                    if (targetEl) {
                        let st = targetEl;
                        if (targetEl.classList.contains("kpi-value")) st = targetEl.closest(".kpi-card") || targetEl;
                        positionSpotlight(st, dot, tooltip, overlay);
                    }
                }, 100);
            });

            showStep(0, true);
        }, 600);
    }

    /* ——— Screen recorder ——— */
    function createRecordUI() {
        const bar = document.createElement("div");
        bar.id = "recordBar";
        bar.className = "record-bar";
        bar.innerHTML = `
      <div class="record-bar-inner">
        <span class="record-bar-dot"></span>
        <span class="record-bar-label" id="recordLabel">Ready to record</span>
        <button class="record-bar-btn record-bar-btn--start" id="recordStartBtn">Start Recording</button>
        <button class="record-bar-btn record-bar-btn--stop hidden" id="recordStopBtn">Stop Recording</button>
      </div>
    `;
        document.body.appendChild(bar);

        /* Inject styles */
        const style = document.createElement("style");
        style.textContent = `
      .record-bar{position:fixed;top:0;left:0;right:0;z-index:99999;padding:10px 20px;background:rgba(24,24,24,0.92);backdrop-filter:blur(10px);border-bottom:1px solid #35211a;display:flex;justify-content:center;transition:background 300ms}
      .record-bar.is-recording{background:rgba(180,40,40,0.92)}
      .record-bar-inner{display:flex;align-items:center;gap:12px}
      .record-bar-dot{width:10px;height:10px;border-radius:50%;background:#666;transition:background 300ms}
      .record-bar.is-recording .record-bar-dot{background:#ef4444;animation:recPulse 1s ease-in-out infinite}
      .record-bar-label{font-family:"IBM Plex Mono",monospace;font-size:0.75rem;color:#b6a596;text-transform:uppercase;letter-spacing:0.12em}
      .record-bar-btn{font-family:"IBM Plex Mono",monospace;font-size:0.72rem;text-transform:uppercase;letter-spacing:0.1em;padding:6px 16px;border-radius:100px;border:1px solid #35211a;cursor:pointer;transition:all 200ms}
      .record-bar-btn--start{background:rgba(220,159,133,0.15);color:#dc9f85;border-color:#dc9f85}
      .record-bar-btn--start:hover{background:rgba(220,159,133,0.3)}
      .record-bar-btn--stop{background:rgba(239,68,68,0.15);color:#ef4444;border-color:#ef4444}
      .record-bar-btn--stop:hover{background:rgba(239,68,68,0.3)}
      .hidden{display:none!important}
      @keyframes recPulse{0%,100%{opacity:1}50%{opacity:0.4}}
    `;
        document.head.appendChild(style);

        return bar;
    }

    async function startRecording(companyKey) {
        const bar = document.getElementById("recordBar");
        const startBtn = document.getElementById("recordStartBtn");
        const stopBtn = document.getElementById("recordStopBtn");
        const label = document.getElementById("recordLabel");

        let stream;
        try {
            stream = await navigator.mediaDevices.getDisplayMedia({
                video: { displaySurface: "browser" },
                audio: false
            });
        } catch (e) {
            label.textContent = "Recording cancelled";
            return;
        }

        const chunks = [];
        const recorder = new MediaRecorder(stream, { mimeType: "video/webm" });
        window._demoRecorder = recorder;

        recorder.ondataavailable = (e) => {
            if (e.data.size > 0) chunks.push(e.data);
        };

        recorder.onstop = () => {
            stream.getTracks().forEach((t) => t.stop());
            bar.classList.remove("is-recording");
            label.textContent = "Saving...";
            stopBtn.classList.add("hidden");

            const blob = new Blob(chunks, { type: "video/webm" });
            const url = URL.createObjectURL(blob);
            const a = document.createElement("a");
            a.href = url;
            a.download = `persana-demo-${companyKey}-${Date.now()}.webm`;
            a.click();
            URL.revokeObjectURL(url);

            label.textContent = "Recording saved!";
            setTimeout(() => bar.remove(), 3000);
        };

        /* If user stops sharing via browser UI */
        stream.getVideoTracks()[0].onended = () => {
            if (recorder.state === "recording") recorder.stop();
        };

        recorder.start();
        bar.classList.add("is-recording");
        label.textContent = "Recording...";
        startBtn.classList.add("hidden");
        stopBtn.classList.remove("hidden");

        stopBtn.addEventListener("click", () => {
            if (recorder.state === "recording") recorder.stop();
        });

        /* Start the demo in auto-play mode after a short pause */
        setTimeout(() => {
            startDemo(companyKey, true);
        }, 800);
    }

    /* ——— Init: check for ?demo=1 ——— */
    function init() {
        const params = new URLSearchParams(window.location.search);
        if (params.get("demo") !== "1") return;

        const companyKey = params.get("company");
        const isRecord = params.get("record") === "1";

        /* Small delay for page to settle */
        const delay = 400;
        setTimeout(() => {
            if (isRecord && companyKey) {
                /* Record mode: show record bar, wait for user to click start */
                createRecordUI();
                document.getElementById("recordStartBtn").addEventListener("click", () => {
                    startRecording(companyKey);
                });
                return;
            }

            if (companyKey && DEMO_COMPANIES.find((c) => c.key === companyKey)) {
                /* Company was chosen on landing page — start demo directly */
                startDemo(companyKey, false);
            } else {
                /* No company specified — show picker as fallback */
                const picker = createPickerOverlay();
                picker.classList.add("is-active");

                picker.addEventListener("click", (e) => {
                    const card = e.target.closest(".demo-picker-card");
                    if (card) {
                        picker.classList.remove("is-active");
                        setTimeout(() => picker.remove(), 300);
                        startDemo(card.dataset.company, false);
                        return;
                    }
                    if (e.target.id === "demoPickerCancel") {
                        picker.classList.remove("is-active");
                        setTimeout(() => picker.remove(), 300);
                        const url = new URL(window.location);
                        url.searchParams.delete("demo");
                        window.history.replaceState({}, "", url.toString());
                    }
                });
            }
        }, delay);
    }

    window.addEventListener("DOMContentLoaded", init);
})();
