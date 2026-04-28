import { useState ,useEffect, useMemo} from "react";
import styles  from  "./Progress.module.css"

const STRAPI_URL = import.meta.env.VITE_STRAPI_URL || 'http://localhost:1337';

/*CONSTANTS */
const CATEGORIES = ["Health & Fitness", "Learning", "Career", "Finance", "Personal", "Creative", "Relationships"];
const CATEGORY_COLORS = {
  "Health & Fitness": "#10b981",
  "Learning": "#6366f1",
  "Career": "#f59e0b",
  "Finance": "#14b8a6",
  "Personal": "#ec4899",
  "Creative": "#f97316",
  "Relationships": "#8b5cf6",
};

const goalTypes = [
  { value: "short-term", label: "Short-Term", activeClass: "active-short" },
  { value: "long-term", label: "Long-Term", activeClass: "active-long" },
];

const DAYS_SHORT = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];


function fmtHour(h) {
  const ampm = h < 12 ? "AM" : "PM";
  const h12 = h === 0 ? 12 : h > 12 ? h - 12 : h;
  return `${h12}:00 ${ampm}`;
}

function scheduleLabel(action) {
  const time = fmtHour(action.schedule.hour);
  if (action.frequency === "daily")    return `Every day at ${time}`;
  if (action.frequency === "interval") return `Every ${action.schedule.intervalDays ?? 2} days at ${time}`;
  if (action.frequency === "weekly") {
    const days = (action.schedule.daysOfWeek ?? []).map(d => DAYS_SHORT[d]).join(", ");
    return `${days} at ${time}`;
  }
  if (action.frequency === "monthly") {
    const d = action.schedule.dayOfMonth ?? 1;
    const suffix = d === 1 ? "st" : d === 2 ? "nd" : d === 3 ? "rd" : "th";
    return `${d}${suffix} of month at ${time}`;
  }
  return time;
}

function calculateProjectedSessions(action, startDate, endDate) {
  const start = new Date(startDate);
  const end   = new Date(endDate);
  const diffDays = Math.max(1, Math.ceil((end - start) / (1000 * 60 * 60 * 24)));
  if (action.frequency === "daily")    return diffDays;
  if (action.frequency === "interval") return Math.ceil(diffDays / (action.schedule.intervalDays ?? 2));
  if (action.frequency === "weekly")   return Math.ceil(diffDays / 7) * (action.schedule.daysOfWeek?.length ?? action.timesPerPeriod);
  if (action.frequency === "monthly")  return Math.ceil(diffDays / 30);
  return diffDays;
}

function calculateGoalProgress(goal) {
  if (!goal.actions || goal.actions.length === 0) return 0;
  const progresses = goal.actions.map(a => {
    const projected = calculateProjectedSessions(a, goal.startDate, goal.endDate);
    return projected === 0 ? 0 : Math.min(100, (a.completedSessions / projected) * 100);
  });
  return progresses.reduce((s, p) => s + p, 0) / progresses.length;
}

function getDaysRemaining(endDate) {
  return Math.ceil((new Date(endDate) - new Date()) / (1000 * 60 * 60 * 24));
}


function getMilestone(p) {
  if (p >= 100) return { label: "Goal Complete!", color: "#10b981" };
  if (p >= 75)  return { label: "75% Reached",    color: "#6366f1" };
  if (p >= 50)  return { label: "Halfway There",  color: "#f59e0b" };
  if (p >= 25)  return { label: "25% Milestone",  color: "#14b8a6" };
  return null;
}

function isScheduledOn(action, dateStr, startDate) {
  const date  = new Date(dateStr + "T00:00:00");
  const start = new Date(startDate + "T00:00:00");
  if (date < start) return false;
  if (action.frequency === "daily")   return true;
  if (action.frequency === "weekly")  return (action.schedule.daysOfWeek ?? []).includes(date.getDay());
  if (action.frequency === "monthly") return date.getDate() === (action.schedule.dayOfMonth ?? 1);
  if (action.frequency === "interval") {
    const diffDays = Math.round((date - start) / (1000 * 60 * 60 * 24));
    return diffDays % (action.schedule.intervalDays ?? 2) === 0;
  }
  return false;
}

function getStreak(action) {
  const today = new Date();
  let streak = 0;
  for (let i = 0; i < 365; i++) {
    const d = new Date(today);
    d.setDate(d.getDate() - i);
    const ds = d.toISOString().split("T")[0];
    if ((action.completedDates ?? []).includes(ds)) streak++;
    else if (i > 0) break;
  }
  return streak;
}

function getTodayActions(goals) {
  const today = new Date().toISOString().split("T")[0];
  const out = [];
  for (const goal of goals) {
    for (const action of (goal.actions ?? [])) {
      if (isScheduledOn(action, today, goal.startDate)) {
        out.push({ goal, action, isDone: (action.completedDates ?? []).includes(today) });
      }
    }
  }
  return out;
}

function normalizeAction(a) {
  const attr = a.attributes ?? a;
  return {
    id: a.id ?? attr.id,
    name: attr.name,
    description: attr.description ?? "",
    frequency: attr.frequency,
    timesPerPeriod: attr.timesPerPeriod ?? 1,
    completedSessions: attr.completedSessions ?? 0,
    completedDates: attr.completedDates ?? [],
    schedule: {
      hour: attr.hour ?? 7,
      daysOfWeek: attr.daysOfWeek ?? [],
      dayOfMonth: attr.dayOfMonth ?? 1,
      intervalDays: attr.intervalDays ?? 2,
    },
  };
}

function normalizeGoal(g) {
  const attr = g.attributes ?? g;
  const rawActions = attr.actions?.data ?? attr.actions ?? [];
  return {
    id: g.id ?? attr.id,
    title: attr.title,
    description: attr.description ?? "",
    startDate: attr.startDate,
    endDate: attr.endDate,
    goalType: attr.goalType,
    category: attr.category,
    actions: rawActions.map(normalizeAction),
  };
}

function ProgressRing({ progress, size = 60, color }) {
  const radius = (size - 8) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (progress / 100) * circumference;
  return (
    <svg width={size} height={size} className={styles.gd_ring}>
      <circle cx={size / 2} cy={size / 2} r={radius} fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth={6} />
      <circle cx={size / 2} cy={size / 2} r={radius} fill="none" stroke={color} strokeWidth={6}
        strokeDasharray={circumference} strokeDashoffset={offset} strokeLinecap="round" />
    </svg>
  );
}

function MilestoneBar({ progress }) {
  return (
    <div className={styles.gd_milestone_track}>
      {[25, 50, 75, 100].map(m => (
        <div key={m}
          className={`${styles.gd_milestone_dot} ${progress >= m ? styles.active : ""}`}
          style={{ left: `${m}%` }} />
      ))}
      <div className={styles.gd_milestone_fill} style={{ width: `${Math.min(100, progress)}%` }} />
    </div>
  );
}

function FreqBadge({ action }) {
  const map = {
    daily:    { cls: styles.gd_badge_daily,    label: "DAILY" },
    weekly:   { cls: styles.gd_badge_weekly,   label: "WEEKLY" },
    monthly:  { cls: styles.gd_badge_monthly,  label: "MONTHLY" },
    interval: { cls: styles.gd_badge_interval, label: `EVERY ${action.schedule.intervalDays ?? 2}D` },
  };
  const s = map[action.frequency] ?? map.daily;
  return <span className={`${styles.gd_badge} ${s.cls}`}>{s.label}</span>;
}


function AddGoalForm({onClose,onCreated}){
const [title,setTitle] = useState("");
const [description,setDescription] = useState("");
const [startDate,setStartDate] = useState("01/01/2026");
const [endDate, setEndDate] = useState("07/07/2026");
const [goaltype,setGoalType] = useState("short-term");
const [category,setCategory] = useState(CATEGORIES[0]);
const [step,setStep] = useState("goal");

  const [actions, setActions] = useState([]);
  const [aName, setAName]     = useState("");
  const [aDesc, setADesc]     = useState("");
  const [aFreq, setAFreq]     = useState("daily");
  const [aHour, setAHour]     = useState(7);
  const [aDow, setADow]       = useState([1, 3, 5]);
  const [aDay, setADay]       = useState(1);
  const [aInt, setAInt]       = useState(2);

const [loading, setLoading]         = useState(false);
const [error, setError]             = useState(null);
const [success, setSuccess]         = useState(false);


const toggleDow = d => setADow(p => p.includes(d) ? p.filter(x => x !== d) : [...p, d]);

  const getProjection = () => {
    if (!startDate || !endDate) return 0;
    const fake = {
      frequency: aFreq,
      timesPerPeriod: aDow.length,
      schedule: { hour: aHour, daysOfWeek: aDow, dayOfMonth: aDay, intervalDays: aInt },
      completedSessions: 0,
    };
    return calculateProjectedSessions(fake, startDate, endDate);
  };

  const addAction = () => {
    if (!aName.trim()) return;
    setActions(prev => [...prev, {
      tempId: Date.now().toString(),
      name: aName,
      description: aDesc,
      frequency: aFreq,
      timesPerPeriod: aFreq === "weekly" ? aDow.length : 1,
      schedule: { hour: aHour, daysOfWeek: aDow, dayOfMonth: aDay, intervalDays: aInt },
      completedSessions: 0,
      completedDates: [],
    }]);
    setAName(""); setADesc(""); setAFreq("daily"); setAHour(7); setADow([1, 3, 5]); setAInt(2);
  };  


const handleSubmit = async (e) =>{
   e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(false);

     try {
      const goalPayload = {
        data: {
          title : title,
          description : description,
          startDate: startDate || null,
          endDate: endDate || null,
          goalType : goaltype,
          category : category,
        },
      };

      const goalResponse = await fetch(`${STRAPI_URL}/api/goals`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(goalPayload),
      });

      const goalData = await goalResponse.json();
      if (!goalResponse.ok) throw new Error(goalResponse.error?.message || `Error ${goalResponse.status}`);


      const newGoalId = goalData.data?.id ?? goalData.id;

      for (const a of actions) {
        const actionPayload = {
          data: {
            name: a.name,
            description: a.description,
            frequency: a.frequency,
            timesPerPeriod: a.timesPerPeriod,
            hour: a.schedule.hour,
            daysOfWeek: a.schedule.daysOfWeek,
            dayOfMonth: a.schedule.dayOfMonth,
            intervalDays: a.schedule.intervalDays,
            completedSessions: 0,
            completedDates: [],
            goal: newGoalId,
          },
        };
        const actRes = await fetch(`${STRAPI_URL}/api/actions`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(actionPayload),
        });
        if (!actRes.ok) {
          const err = await actRes.json();
          throw new Error(err.error?.message || `Action error ${actRes.status}`);
        }
      }

      setSuccess(true);
      if (onCreated) await onCreated();
      setTimeout(() => { setSuccess(false); onClose(); }, 1200);

    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
 

}

 return (
    <div className={styles.gd_overlay}>
      <div className={styles.gd_modal}>

        <div className={styles.gd_modal_header}>
          <div className={styles.gd_modal_eyebrow}>PROGRESS & GOALS</div>
          <div className={styles.gd_modal_title}>
            {step === "goal" ? "Define Your Goal" : "Build Your System"}
          </div>
        </div>

        <div className={styles.gd_modal_body}>

          <div className={styles.gd_modal_steps}>
            <button
              onClick={() => setStep("goal")}
              className={`${styles.gd_step_btn} ${step === "goal" ? styles.active : ""}`}>
              1. Goal Details
            </button>
            <button
              onClick={() => setStep("system")}
              className={`${styles.gd_step_btn} ${step === "system" ? styles.active : ""}`}>
              2. Action System
            </button>
          </div>

          {step === "goal" ? (
            <div className={styles.gd_form}>

              <div className={styles.gd_field}>
                <label className={styles.gd_label}>GOAL TITLE</label>
                <input
                  className={styles.gd_input}
                  placeholder="What do you want to achieve?"
                  value={title}
                  onChange={e => setTitle(e.target.value)} />
              </div>

              <div className={styles.gd_field}>
                <label className={styles.gd_label}>DESCRIPTION</label>
                <textarea
                  className={styles.gd_input_textarea}
                  placeholder="What does success look like?"
                  value={description}
                  onChange={e => setDescription(e.target.value)} />
              </div>

              <div className={styles.gd_row_2}>
                <div className={styles.gd_field}>
                  <label className={styles.gd_label}>START DATE</label>
                  <input
                    type="date"
                    className={styles.gd_input}
                    value={startDate}
                    onChange={e => setStartDate(e.target.value)} />
                </div>
                <div className={styles.gd_field}>
                  <label className={styles.gd_label}>DEADLINE</label>
                  <input
                    type="date"
                    className={styles.gd_input}
                    value={endDate}
                    onChange={e => setEndDate(e.target.value)} />
                </div>
              </div>

              <div className={styles.gd_field}>
                <label className={styles.gd_label}>GOAL TYPE</label>
                <div className={styles.gd_toggle_row}>
                  <button
                    onClick={() => setGoalType("short-term")}
                    className={`${styles.gd_toggle_btn} ${goaltype === "short-term" ? styles.active_short : ""}`}>
                    Short-Term
                  </button>
                  <button
                    onClick={() => setGoalType("long-term")}
                    className={`${styles.gd_toggle_btn} ${goaltype === "long-term" ? styles.active_long : ""}`}>
                    Long-Term
                  </button>
                </div>
              </div>

              <div className={styles.gd_field}>
                <label className={styles.gd_label}>CATEGORY</label>
                <div className={styles.gd_chip_row}>
                  {CATEGORIES.map(c => (
                    <button
                      key={c}
                      onClick={() => setCategory(c)}
                      className={`${styles.gd_chip} ${category === c ? styles.active : ""}`}
                      style={category === c ? { borderColor: CATEGORY_COLORS[c], color: CATEGORY_COLORS[c], background: `${CATEGORY_COLORS[c]}18` } : {}}>
                      {c}
                    </button>
                  ))}
                </div>
              </div>

              {error && <div className={styles.gd_error}>{error}</div>}
              {success && <div className={styles.gd_success}>Goal created!</div>}

              <div className={styles.gd_modal_actions}>
                <button className={styles.gd_btn_ghost} onClick={onClose}>Cancel</button>
                <button
                  className={styles.gd_btn_primary}
                  onClick={() => setStep("system")}>
                  Next: Build Your System →
                </button> 
              </div>

            </div>
          ) : (
            <div className={styles.gd_form}>
 {actions.length > 0 && (
                <div className={styles.gd_field}>
                  <label className={styles.gd_label}>YOUR SYSTEM ({actions.length} action{actions.length !== 1 ? "s" : ""})</label>
                  {actions.map(a => (
                    <div key={a.tempId} className={styles.gd_system_item}>
                      <div className={styles.gd_system_item_info}>
                        <div className={styles.gd_action_row}>
                          <span className={styles.gd_action_name}>{a.name}</span>
                          <FreqBadge action={a} />
                        </div>
                        <div className={styles.gd_action_schedule}>🕐 {scheduleLabel(a)}</div>
                        {endDate && (
                          <div className={styles.gd_projection}>
                            → {calculateProjectedSessions(a, startDate, endDate)} sessions projected
                          </div>
                        )}
                      </div>
                      <button className={styles.gd_remove_btn}
                        onClick={() => setActions(p => p.filter(x => x.tempId !== a.tempId))}>×</button>
                    </div>
                  ))}
                </div>
              )}

              <div className={styles.gd_add_action_box}>
                <label className={styles.gd_label}>ADD AN ACTION</label>
                <input className={styles.gd_input} placeholder="Action name (e.g. Gym workout)"
                  value={aName} onChange={e => setAName(e.target.value)} />
                <input className={styles.gd_input} placeholder="What does doing this well look like?"
                  value={aDesc} onChange={e => setADesc(e.target.value)} />

                <div className={styles.gd_field}>
                  <label className={styles.gd_label}>FREQUENCY TYPE</label>
                  <div className={styles.gd_freq_grid}>
                    {["daily", "weekly", "monthly", "interval"].map(f => (
                      <button key={f} onClick={() => setAFreq(f)}
                        className={`${styles.gd_freq_btn} ${aFreq === f ? styles.active : ""}`}>
                        {f === "interval" ? "Every N days" : f.charAt(0).toUpperCase() + f.slice(1)}
                      </button>
                    ))}
                  </div>
                </div>

                {aFreq === "weekly" && (
                  <div className={styles.gd_field}>
                    <label className={styles.gd_label}>DAYS OF WEEK</label>
                    <div className={styles.gd_dow_row}>
                      {DAYS_SHORT.map((d, i) => (
                        <button key={i} onClick={() => toggleDow(i)}
                          className={`${styles.gd_dow_btn} ${aDow.includes(i) ? styles.active : ""}`}>
                          {d}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {aFreq === "monthly" && (
                  <div className={styles.gd_field}>
                    <label className={styles.gd_label}>DAY OF MONTH — {aDay}</label>
                    <input type="range" min={1} max={28} value={aDay}
                      onChange={e => setADay(+e.target.value)} className={styles.gd_range} />
                  </div>
                )}

                {aFreq === "interval" && (
                  <div className={styles.gd_field}>
                    <label className={styles.gd_label}>REPEAT EVERY</label>
                    <div className={styles.gd_interval_row}>
                      {[2, 3, 4, 5, 7, 10, 14].map(n => (
                        <button key={n} onClick={() => setAInt(n)}
                          className={`${styles.gd_interval_btn} ${aInt === n ? styles.active : ""}`}>
                          {n}d
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                <div className={styles.gd_field}>
                  <label className={styles.gd_label}>TIME OF DAY — {fmtHour(aHour)}</label>
                  <input type="range" min={5} max={23} value={aHour}
                    onChange={e => setAHour(+e.target.value)} className={styles.gd_range} />
                  <div className={styles.gd_range_labels}>
                    <span>5 AM</span><span>12 PM</span><span>11 PM</span>
                  </div>
                </div>

                {endDate && (
                  <div className={styles.gd_projection_box}>
                    → {getProjection()} sessions projected by your deadline
                  </div>
                )}

                <button className={styles.gd_btn_secondary} onClick={addAction} disabled={!aName.trim()}>
                  + Add to system
                </button>
              </div>

              {error   && <div className={styles.gd_error}>{error}</div>}
              {success && <div className={styles.gd_success}>Goal created!</div>}
              
              <div className={styles.gd_modal_actions}>
                <button className={styles.gd_btn_ghost} onClick={() => setStep("goal")}>← Back</button>
                <button
                  className={styles.gd_btn_primary}
                  onClick={handleSubmit}
                  disabled={loading || !title.trim() || !endDate}>
                  {loading ? "Creating..." : "Create Goal"}
                </button>
              </div>

            </div>
          )}

        </div>
      </div>
    </div>
  );
}


function StatsBar() {
  return (
    <div className={styles.gd_stats_bar}>
      <div className={styles.gd_stat_card}>
        <div className={styles.gd_stat_label}>AVG PROGRESS</div>
        <div className={styles.gd_stat_value} style={{ color: "#6366f1" }}>0%</div>
      </div>

      <div className={styles.gd_stat_card}>
        <div className={styles.gd_stat_label}>ON TRACK</div>
        <div className={styles.gd_stat_value} style={{ color: "#10b981" }}>0/0</div>
      </div>

      <div className={styles.gd_stat_card}>
        <div className={styles.gd_stat_label}>SYSTEM ACTIONS</div>
        <div className={styles.gd_stat_value} style={{ color: "#f59e0b" }}>0</div>
      </div>

      <div className={styles.gd_stat_card}>
        <div className={styles.gd_stat_label}>TODAY</div>
        <div className={styles.gd_stat_value} style={{ color: "#ec4899" }}>0/0</div>
      </div>
    </div>
  );
}


function TodayPanel({ goals, onLog }) {
  const items = getTodayActions(goals);
  const done = items.filter(i => i.isDone).length;

  return (
    <div className={styles.gd_today}>
      <div className={styles.gd_today_header}>
        <div>
          <div className={styles.gd_today_title}>Today's Actions</div>
          <div className={styles.gd_today_date}>
            {new Date().toLocaleDateString("en", { weekday: "long", month: "long", day: "numeric" })}
          </div>
        </div>
        <div className={styles.gd_today_count}>
          <span className={done === items.length && items.length > 0 ? styles.complete : ""}>
            {done}/{items.length}
          </span>
          <small>completed</small>
        </div>
      </div>

      {items.length === 0 ? (
        <div className={styles.gd_today_empty}>Nothing scheduled for today</div>
      ) : (
        <div className={styles.gd_today_list}>
          {items
            .sort((a, b) => a.action.schedule.hour - b.action.schedule.hour)
            .map(({ goal, action, isDone }) => {
              const streak = getStreak(action);
              return (
                <div key={action.id} className={`${styles.gd_today_item} ${isDone ? styles.done : ""}`}>
                  <div className={styles.gd_today_dot}>
                    {isDone ? "✓" : fmtHour(action.schedule.hour).split(":")[0]}
                  </div>
                  <div className={styles.gd_today_info}>
                    <div className={`${styles.gd_today_name} ${isDone ? styles.done : ""}`}>{action.name}</div>
                    <div className={styles.gd_today_meta}>{goal.title} · {fmtHour(action.schedule.hour)}</div>
                  </div>
                  {streak > 1 && <span className={styles.gd_streak}>🔥 {streak}</span>}
                  {!isDone && (
                    <button className={styles.gd_btn_done} onClick={() => onLog(goal.id, action.id)}>Done</button>
                  )}
                </div>
              );
            })}
        </div>
      )}
    </div>
  );
}

/* ─── GOAL CARD ───────────────────────────────────────────────────────────── */
function GoalCard({ goal, onLog }) {
  const [expanded, setExpanded] = useState(false);
  const progress  = calculateGoalProgress(goal);
  const daysLeft  = getDaysRemaining(goal.endDate);
  const milestone = getMilestone(progress);
  const color     = CATEGORY_COLORS[goal.category] || "#6366f1";

  return (
    <div className={styles.gd_card}>
      <div className={styles.gd_card_row}>
        <div className={styles.gd_ring_wrap}>
          <ProgressRing progress={progress} size={64} color={color} />
          <span className={styles.gd_ring_pct}>{Math.round(progress)}%</span>
        </div>

        <div className={styles.gd_card_body}>
          <div className={styles.gd_card_tags}>
            <span className={styles.gd_card_title}>{goal.title}</span>
            <span className={`${styles.gd_type_badge} ${goal.goalType === "long-term" ? styles.long : styles.short}`}>
              {goal.goalType === "long-term" ? "LONG-TERM" : "SHORT-TERM"}
            </span>
            <span className={styles.gd_category_tag}>{goal.category}</span>
          </div>
          <p className={styles.gd_card_desc}>{goal.description}</p>
          <MilestoneBar progress={progress} />
          <div className={styles.gd_card_meta}>
            {milestone && (
              <span className={styles.gd_milestone_label} style={{ color: milestone.color }}>
                🏆 {milestone.label}
              </span>
            )}
            <span className={`${styles.gd_days} ${daysLeft < 14 ? styles.urgent : ""}`}>
              {daysLeft > 0 ? `${daysLeft}d left` : daysLeft === 0 ? "Due today" : `${Math.abs(daysLeft)}d overdue`}
            </span>
            <span className={styles.gd_action_count}>{goal.actions.length} actions in system</span>
          </div>
        </div>

        <button className={styles.gd_expand_btn} onClick={() => setExpanded(!expanded)}>
          {expanded ? "Hide" : "System"}
        </button>
      </div>

      {expanded && (
        <div className={styles.gd_system}>
          <div className={styles.gd_system_header}>YOUR SYSTEM — {goal.actions.length} ACTIONS</div>
          {goal.actions.map(action => {
            const projected = calculateProjectedSessions(action, goal.startDate, goal.endDate);
            const pct = projected > 0 ? Math.min(100, (action.completedSessions / projected) * 100) : 0;
            const streak = getStreak(action);
            return (
              <div key={action.id} className={styles.gd_action}>
                <div className={styles.gd_action_info}>
                  <div className={styles.gd_action_row}>
                    <span className={styles.gd_action_name}>{action.name}</span>
                    <FreqBadge action={action} />
                    {streak > 1 && <span className={styles.gd_streak}>🔥 {streak} streak</span>}
                  </div>
                  <p className={styles.gd_action_desc}>{action.description}</p>
                  <div className={styles.gd_action_schedule}>🕐 {scheduleLabel(action)}</div>
                  <div className={styles.gd_action_progress}>
                    <div className={styles.gd_action_bar}>
                      <div className={styles.gd_action_fill} style={{ width: `${pct}%`, background: color }} />
                    </div>
                    <span className={styles.gd_action_count}>{action.completedSessions}/{projected}</span>
                  </div>
                </div>
                <button className={styles.gd_log_btn} onClick={() => onLog(goal.id, action.id)}>+ Log</button>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

function WeekCalendar({ goals }) {
  const [weekOffset, setWeekOffset] = useState(0);

  const weekDays = useMemo(() => {
    const days = [];
    const now = new Date();
    const monday = new Date(now);
    monday.setDate(now.getDate() - ((now.getDay() + 6) % 7) + weekOffset * 7);
    for (let i = 0; i < 7; i++) {
      const d = new Date(monday);
      d.setDate(monday.getDate() + i);
      days.push(d);
    }
    return days;
  }, [weekOffset]);

  const todayStr = new Date().toISOString().split("T")[0];

  return (
    <div className={styles.gd_cal}>
      <div className={styles.gd_cal_header}>
        <span className={styles.gd_cal_range}>
          {weekDays[0].toLocaleDateString("en", { month: "short", day: "numeric" })} –{" "}
          {weekDays[6].toLocaleDateString("en", { month: "short", day: "numeric", year: "numeric" })}
        </span>
        <div className={styles.gd_cal_nav}>
          <button onClick={() => setWeekOffset(w => w - 1)}>‹</button>
          <button onClick={() => setWeekOffset(0)}>Today</button>
          <button onClick={() => setWeekOffset(w => w + 1)}>›</button>
        </div>
      </div>

      <div className={styles.gd_cal_grid}>
        {weekDays.map(day => {
          const ds = day.toISOString().split("T")[0];
          const isToday = ds === todayStr;
          const slots = [];
          for (const goal of goals) {
            for (const action of (goal.actions ?? [])) {
              if (isScheduledOn(action, ds, goal.startDate)) {
                slots.push({
                  action,
                  isDone: (action.completedDates ?? []).includes(ds),
                  goalColor: CATEGORY_COLORS[goal.category] || "#6366f1",
                });
              }
            }
          }
          slots.sort((a, b) => a.action.schedule.hour - b.action.schedule.hour);
          return (
            <div key={ds} className={`${styles.gd_cal_day} ${isToday ? styles.today : ""}`}>
              <div className={styles.gd_cal_day_header}>
                <div className={styles.gd_cal_dow}>{DAYS_SHORT[day.getDay()]}</div>
                <div className={`${styles.gd_cal_date} ${isToday ? styles.today : ""}`}>{day.getDate()}</div>
              </div>
              {slots.map(({ action, isDone, goalColor }) => (
                <div key={action.id}
                  className={`${styles.gd_cal_slot} ${isDone ? styles.done : ""}`}
                  style={isDone ? { background: `${goalColor}25`, color: goalColor, borderColor: `${goalColor}40` } : {}}
                  title={`${action.name} @ ${fmtHour(action.schedule.hour)}`}>
                  <span>{isDone ? "✓" : "○"}</span>
                  <span>{action.name}</span>
                </div>
              ))}
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default function Progress() {
  const [goals, setGoals]               = useState([]);
  const [showForm, setShowForm]         = useState(false);
  const [view, setView]                 = useState("goals");
  const [filter, setFilter]             = useState("all");
  const [loadingGoals, setLoadingGoals] = useState(false);

  const fetchGoals = async () => {
    try {
      setLoadingGoals(true);
      const res = await fetch(`${STRAPI_URL}/api/goals?populate=actions`);
      const data = await res.json();
      const list = (data.data ?? []).map(normalizeGoal);
      setGoals(list);
    } catch (err) {
      console.error("Failed to load goals", err);
    } finally {
      setLoadingGoals(false);
    }
  };

  useEffect(() => { fetchGoals(); }, []);

  const filteredGoals = useMemo(
    () => goals.filter(g => filter === "all" || g.goalType === filter),
    [goals, filter]
  );

  const handleLog = async (goalId, actionId) => {
    const today = new Date().toISOString().split("T")[0];
    const goal = goals.find(g => g.id === goalId);
    const action = goal?.actions.find(a => a.id === actionId);
    if (!action) return;

    const newDates = (action.completedDates ?? []).includes(today)
      ? action.completedDates
      : [...(action.completedDates ?? []), today];
    const newSessions = action.completedSessions + 1;

    setGoals(prev => prev.map(g =>
      g.id !== goalId ? g : {
        ...g,
        actions: g.actions.map(a =>
          a.id !== actionId ? a : { ...a, completedSessions: newSessions, completedDates: newDates }
        ),
      }
    ));

    try {
      await fetch(`${STRAPI_URL}/api/actions/${actionId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ data: { completedSessions: newSessions, completedDates: newDates } }),
      });
    } catch (err) {
      console.error("Failed to log action", err);
      fetchGoals();
    }
  };

  return (
    <div className={styles.pagecontainer}>
      <div className={styles.gd_root}>

        <div className={styles.gd_header}>
          <div className={styles.gd_header_left}>
            <div className={styles.gd_eyebrow}>PROGRESS & GOALS</div>
            <h1 className={styles.gd_h1}>Your Goals</h1>
            <p className={styles.gd_subtitle}>Build the system. Let the results follow.</p>
          </div>
          <button className={styles.gd_btn_new} onClick={() => setShowForm(true)}>+ New Goal</button>
        </div>

        {showForm && <AddGoalForm onClose={() => setShowForm(false)} onCreated={fetchGoals} />}

        <div className={styles.gd_tabs}>
          <button onClick={() => setView("goals")}
            className={`${styles.gd_tab} ${view === "goals" ? styles.active : ""}`}>Goals</button>
          <button onClick={() => setView("calendar")}
            className={`${styles.gd_tab} ${view === "calendar" ? styles.active : ""}`}>Calendar</button>
        </div>

        <div className={styles.gd_body}>
          <StatsBar goals={goals} />
          <TodayPanel goals={goals} onLog={handleLog} />

          {view === "calendar" ? (
            <WeekCalendar goals={goals} />
          ) : (
            <>
              <div className={styles.gd_filter_row}>
                {["all", "short-term", "long-term"].map(f => (
                  <button key={f} onClick={() => setFilter(f)}
                    className={`${styles.gd_filter_btn} ${filter === f ? styles.active : ""}`}>
                    {f === "all" ? "All Goals" : f === "short-term" ? "Short-Term" : "Long-Term"}
                  </button>
                ))}
              </div>

              {filteredGoals.length === 0 ? (
                <div className={styles.gd_empty}>
                  <div className={styles.gd_empty_icon}>🎯</div>
                  <div className={styles.gd_empty_title}>
                    {loadingGoals ? "Loading goals..." : "No goals yet"}
                  </div>
                  <p>Set your first goal and build a system to reach it.</p>
                </div>
              ) : (
                filteredGoals.map(goal => <GoalCard key={goal.id} goal={goal} onLog={handleLog} />)
              )}
            </>
          )}
        </div>

      </div>
    </div>
  );
}