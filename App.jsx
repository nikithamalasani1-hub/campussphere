import { useEffect, useMemo, useState } from 'react'
import { NavLink, Route, Routes, useLocation } from 'react-router-dom'
import {
  Activity, ArrowDownRight, ArrowUpRight, Bell, BookOpen, CalendarDays,
  Check, CheckCircle2, ChevronDown, CircleHelp, Clock3, Command, Compass,
  FileText, Filter, GraduationCap, LayoutDashboard, LogOut, Menu, Moon,
  MoreHorizontal, Plus, Search, Settings, Sparkles, Sun, Target, Trash2,
  TrendingUp, Users, X, Zap, Code2, ExternalLink, MapPin, CalendarPlus
} from 'lucide-react'
import { initialTasks, initialEvents, resources } from './data'

const readStore = (key, fallback) => {
  try { return JSON.parse(localStorage.getItem(key)) ?? fallback } catch { return fallback }
}
const saveStore = (key, value) => localStorage.setItem(key, JSON.stringify(value))
const today = new Date('2026-11-03T12:00:00')
const fmt = (value) => new Date(`${value}T12:00:00`).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })
const navItems = [
  { to: '/', label: 'Overview', icon: LayoutDashboard },
  { to: '/tasks', label: 'My tasks', icon: CheckCircle2, count: true },
  { to: '/events', label: 'Campus events', icon: CalendarDays },
  { to: '/resources', label: 'Resources', icon: BookOpen }
]

function App() {
  const [tasks, setTasks] = useState(() => readStore('cs_tasks', initialTasks))
  const [events, setEvents] = useState(() => readStore('cs_events', initialEvents))
  const [dark, setDark] = useState(() => readStore('cs_dark', true))
  const [menuOpen, setMenuOpen] = useState(false)
  const [query, setQuery] = useState('')
  const [showNotifications, setShowNotifications] = useState(false)
  const [modal, setModal] = useState(null)
  const [toast, setToast] = useState('')
  const location = useLocation()

  useEffect(() => saveStore('cs_tasks', tasks), [tasks])
  useEffect(() => saveStore('cs_events', events), [events])
  useEffect(() => saveStore('cs_dark', dark), [dark])
  useEffect(() => { setMenuOpen(false); setQuery('') }, [location.pathname])
  useEffect(() => {
    if (!toast) return
    const id = setTimeout(() => setToast(''), 2600)
    return () => clearTimeout(id)
  }, [toast])

  const completed = tasks.filter(t => t.done).length
  const pending = tasks.filter(t => !t.done).length
  const toggleTask = id => setTasks(prev => prev.map(t => t.id === id ? { ...t, done: !t.done } : t))
  const addTask = task => {
    setTasks(prev => [{ ...task, id: Date.now(), done: false }, ...prev])
    setModal(null); setToast('Task added to your planner')
  }
  const addEvent = event => {
    setEvents(prev => [{ ...event, id: Date.now(), color: 'blue' }, ...prev])
    setModal(null); setToast('Event added successfully')
  }
  const deleteTask = id => { setTasks(prev => prev.filter(t => t.id !== id)); setToast('Task removed') }

  return <div className={dark ? 'app dark' : 'app light'}>
    <aside className={`sidebar ${menuOpen ? 'open' : ''}`}>
      <div className="brand"><div className="brand-mark"><GraduationCap size={21}/></div><span>campus<span className="brand-accent">sphere</span></span></div>
      <div className="workspace-label">WORKSPACE</div>
      <nav className="side-nav">
        {navItems.map(({to,label,icon:Icon,count}) => <NavLink key={to} to={to} end={to === '/'} className={({isActive}) => `nav-link ${isActive ? 'active' : ''}`}>
          <Icon size={18}/><span>{label}</span>{count && pending > 0 && <small>{pending}</small>}
        </NavLink>)}
      </nav>
      <div className="sidebar-card">
        <div className="sidebar-card-icon"><Sparkles size={17}/></div>
        <strong>Make this week count.</strong>
        <p>Small steps today, big results tomorrow.</p>
        <div className="mini-progress"><span style={{width: `${tasks.length ? completed/tasks.length*100 : 0}%`}}/></div>
        <div className="progress-meta"><span>Weekly progress</span><b>{tasks.length ? Math.round(completed/tasks.length*100) : 0}%</b></div>
      </div>
      <div className="sidebar-bottom">
        <div className="profile-row"><div className="avatar">MM</div><div className="profile-copy"><b>Meghana M.</b><span>Student account</span></div><MoreHorizontal size={18}/></div>
        <div className="sidebar-foot"><span>CampusSphere v1.0</span><span>•</span><span>Help center</span></div>
      </div>
    </aside>

    <main className="main">
      <header className="topbar">
        <button className="icon-btn mobile-menu" onClick={() => setMenuOpen(v => !v)} aria-label="Toggle menu"><Menu size={20}/></button>
        <div className="breadcrumb"><span>Workspace</span><span className="crumb-slash">/</span><b>{navItems.find(n => n.to === location.pathname)?.label || 'Overview'}</b></div>
        <div className="top-actions">
          <label className="search-box"><Search size={17}/><input value={query} onChange={e => setQuery(e.target.value)} placeholder="Search anything..." /><kbd>⌘ K</kbd></label>
          <button className="icon-btn" onClick={() => setDark(v => !v)} aria-label="Toggle theme">{dark ? <Sun size={18}/> : <Moon size={18}/>}</button>
          <div className="notification-wrap">
            <button className="icon-btn notification-btn" onClick={() => setShowNotifications(v => !v)} aria-label="Notifications"><Bell size={18}/><i/></button>
            {showNotifications && <div className="notification-pop"><b>You're all caught up</b><p>New reminders and campus updates will appear here.</p></div>}
          </div>
          <div className="top-avatar">MM</div>
        </div>
      </header>

      <div className="page-content">
        <Routes>
          <Route path="/" element={<Dashboard tasks={tasks} events={events} completed={completed} pending={pending} toggleTask={toggleTask} onAdd={() => setModal('task')} query={query} onNavigate={setToast}/>}/>
          <Route path="/tasks" element={<TasksPage tasks={tasks} toggleTask={toggleTask} onAdd={() => setModal('task')} onDelete={deleteTask} query={query}/>}/>
          <Route path="/events" element={<EventsPage events={events} onAdd={() => setModal('event')} query={query}/>}/>
          <Route path="/resources" element={<ResourcesPage query={query}/>}/>
          <Route path="*" element={<Dashboard tasks={tasks} events={events} completed={completed} pending={pending} toggleTask={toggleTask} onAdd={() => setModal('task')} query={query}/>}/>
        </Routes>
      </div>
      <footer className="footer"><span>© 2026 CampusSphere</span><span>Designed for focused student life <span className="footer-heart">✦</span></span></footer>
    </main>
    {modal && <Modal type={modal} onClose={() => setModal(null)} onTask={addTask} onEvent={addEvent}/>}
    {toast && <div className="toast"><CheckCircle2 size={17}/>{toast}</div>}
  </div>
}

function PageHeading({eyebrow,title,description,action,actionLabel='Add new',actionIcon:ActionIcon=Plus}) {
  return <div className="page-heading"><div><div className="eyebrow">{eyebrow}</div><h1>{title}</h1><p>{description}</p></div>{action && <button className="primary-btn" onClick={action}><ActionIcon size={17}/>{actionLabel}</button>}</div>
}

function Dashboard({tasks,events,completed,pending,toggleTask,onAdd,query}) {
  const filtered = tasks.filter(t => `${t.title} ${t.course}`.toLowerCase().includes(query.toLowerCase())).slice(0,4)
  const upcoming = events.slice().sort((a,b) => a.date.localeCompare(b.date)).slice(0,3)
  const completion = tasks.length ? Math.round(completed/tasks.length*100) : 0
  return <>
    <PageHeading eyebrow="TUESDAY, 03 NOVEMBER 2026" title="Good morning, Meghana ✨" description="Here's what's happening with your campus life today." action={onAdd} actionLabel="Add a task"/>
    <section className="welcome-banner">
      <div className="welcome-content"><div className="welcome-tag"><Sparkles size={13}/> YOUR PERSONAL STUDENT HUB</div><h2>Make room for what<br/><span>matters most.</span></h2><p>Stay organised, keep learning, and make every campus day count.</p><div className="welcome-meta"><span><Target size={15}/> Your goals, in one place</span><span><Zap size={15}/> One step at a time</span></div></div>
      <div className="banner-art"><div className="orbit orbit-one"/><div className="orbit orbit-two"/><div className="banner-glow"/><div className="banner-cube"><GraduationCap size={54}/></div><div className="float-chip chip-one"><Check size={14}/> Stay on track</div><div className="float-chip chip-two"><Sparkles size={15}/> You've got this</div></div>
    </section>
    <section className="stats-grid">
      <StatCard icon={CheckCircle2} label="Tasks completed" value={completed} note="Keep the momentum going" trend="+2 this week" color="purple"/>
      <StatCard icon={Clock3} label="Pending tasks" value={pending} note="A little progress adds up" trend="On your list" color="orange"/>
      <StatCard icon={CalendarDays} label="Upcoming events" value={events.length} note="Stay connected on campus" trend="This month" color="blue"/>
      <StatCard icon={TrendingUp} label="Completion rate" value={`${completion}%`} note="Your personal productivity" trend={completion >= 50 ? 'Great progress' : 'Room to grow'} color="green"/>
    </section>
    <section className="dashboard-grid">
      <div className="panel tasks-panel">
        <div className="panel-heading"><div><h3>My tasks</h3><p>Your priorities at a glance</p></div><NavLink to="/tasks" className="text-link">View all <ArrowUpRight size={15}/></NavLink></div>
        <div className="task-list">{filtered.length ? filtered.map(task => <TaskRow key={task.id} task={task} onToggle={toggleTask}/> ) : <EmptyState text="No matching tasks found."/>}</div>
        <button className="add-inline" onClick={onAdd}><Plus size={16}/> Add another task</button>
      </div>
      <div className="panel progress-panel">
        <div className="panel-heading"><div><h3>Your progress</h3><p>A snapshot of your productivity</p></div><button className="subtle-icon"><MoreHorizontal size={18}/></button></div>
        <div className="progress-ring-wrap"><div className="progress-ring" style={{'--progress': `${completion*3.6}deg`}}><div><strong>{completion}%</strong><span>completed</span></div></div></div>
        <div className="progress-legend"><span><i className="legend-dot purple-dot"/>Completed <b>{completed}</b></span><span><i className="legend-dot muted-dot"/>Remaining <b>{pending}</b></span></div>
        <div className="progress-message"><div className="message-icon"><Activity size={16}/></div><span>{completion >= 70 ? 'Excellent work! Keep your streak alive.' : 'You are building a good routine. Keep going!'}</span></div>
      </div>
    </section>
    <section className="panel events-panel">
      <div className="panel-heading"><div><h3>Upcoming on campus</h3><p>Don't miss out on what's happening</p></div><NavLink to="/events" className="text-link">All events <ArrowUpRight size={15}/></NavLink></div>
      <div className="event-strip">{upcoming.map(event => <EventCard key={event.id} event={event}/>)}</div>
    </section>
  </>
}

function StatCard({icon:Icon,label,value,note,trend,color}) {
  return <div className="stat-card"><div className={`stat-icon ${color}`}><Icon size={19}/></div><div className="stat-label">{label}</div><div className="stat-value">{value}</div><div className="stat-bottom"><span>{note}</span><b>{trend}</b></div></div>
}
function TaskRow({task,onToggle,onDelete}) {
  return <div className={`task-row ${task.done ? 'is-done' : ''}`}><button className={`task-check ${task.done ? 'checked' : ''}`} onClick={() => onToggle(task.id)} aria-label="Toggle task">{task.done && <Check size={13}/>}</button><div className="task-info"><b>{task.title}</b><span>{task.course} <i/> Due {fmt(task.date)}</span></div><span className={`priority ${task.priority.toLowerCase()}`}>{task.priority}</span>{onDelete && <button className="delete-btn" onClick={() => onDelete(task.id)} aria-label="Delete task"><Trash2 size={16}/></button>}</div>
}
function EventCard({event}) {
  return <div className="event-card"><div className={`event-date ${event.color}`}><b>{new Date(`${event.date}T12:00:00`).getDate()}</b><span>{new Date(`${event.date}T12:00:00`).toLocaleDateString('en-IN',{month:'short'}).toUpperCase()}</span></div><div className="event-info"><span className={`event-category ${event.color}`}>{event.category}</span><b>{event.title}</b><span><Clock3 size={13}/>{event.time}<i/> <MapPin size={13}/>{event.place}</span></div><button className="event-more" aria-label="Event details"><ArrowUpRight size={17}/></button></div>
}
function TasksPage({tasks,toggleTask,onAdd,onDelete,query}) {
  const [filter,setFilter] = useState('All')
  const shown = tasks.filter(t => (filter === 'All' || (filter === 'Completed' ? t.done : !t.done)) && `${t.title} ${t.course}`.toLowerCase().includes(query.toLowerCase()))
  return <><PageHeading eyebrow="STAY PRODUCTIVE" title="My tasks" description="Plan your work, set priorities, and celebrate every win." action={onAdd} actionLabel="Create task"/><div className="filter-row"><div className="filter-tabs">{['All','Pending','Completed'].map(x=><button key={x} onClick={()=>setFilter(x)} className={filter===x?'selected':''}>{x}<span>{x==='All'?tasks.length:x==='Pending'?tasks.filter(t=>!t.done).length:tasks.filter(t=>t.done).length}</span></button>)}</div><div className="filter-caption"><Filter size={15}/> Showing {shown.length} tasks</div></div><div className="panel full-panel"><div className="panel-heading"><div><h3>Task board</h3><p>Check off tasks as you complete them</p></div><span className="soft-pill">{shown.length} items</span></div><div className="task-list roomy">{shown.map(t=><TaskRow key={t.id} task={t} onToggle={toggleTask} onDelete={onDelete}/>)}</div>{!shown.length && <EmptyState text="Nothing here yet. Add a task to get started."/>}</div></>
}
function EventsPage({events,onAdd,query}) {
  const [category,setCategory] = useState('All')
  const categories = ['All','Workshop','Competition','Seminar']
  const shown = events.filter(e=>(category==='All'||e.category===category)&&`${e.title} ${e.place}`.toLowerCase().includes(query.toLowerCase())).sort((a,b)=>a.date.localeCompare(b.date))
  return <><PageHeading eyebrow="CAMPUS LIFE" title="Campus events" description="Discover workshops, meet people, and make the most of your campus." action={onAdd} actionLabel="Add event" actionIcon={CalendarPlus}/><div className="filter-row"><div className="filter-tabs">{categories.map(x=><button key={x} onClick={()=>setCategory(x)} className={category===x?'selected':''}>{x}</button>)}</div><div className="filter-caption"><CalendarDays size={15}/> {shown.length} upcoming events</div></div><div className="events-list">{shown.map(e=><EventCard key={e.id} event={e}/>)}</div>{!shown.length&&<div className="panel"><EmptyState text="No events match this filter."/></div>}</>
}
function ResourcesPage({query}) {
  const [type,setType] = useState('All')
  const types = ['All',...new Set(resources.map(r=>r.type))]
  const shown = resources.filter(r=>(type==='All'||r.type===type)&&`${r.title} ${r.detail}`.toLowerCase().includes(query.toLowerCase()))
  const icons = [Code2,BookOpen,Zap,Users]
  return <><PageHeading eyebrow="KEEP LEARNING" title="Learning resources" description="A curated collection of tools and references for your learning journey."/><div className="resource-feature"><div className="resource-feature-icon"><BookOpen size={23}/></div><div><span>LEARNING CORNER</span><h2>Curiosity is your superpower.</h2><p>Explore trusted resources, strengthen your fundamentals, and build something great.</p></div><Sparkles className="resource-sparkle" size={34}/></div><div className="filter-row"><div className="filter-tabs">{types.map(x=><button key={x} onClick={()=>setType(x)} className={type===x?'selected':''}>{x}</button>)}</div><div className="filter-caption"><BookOpen size={15}/> {shown.length} resources</div></div><div className="resource-grid">{shown.map((r,i)=>{const Icon=icons[i%icons.length];return <article className="resource-card" key={r.id}><div className="resource-card-top"><div className="resource-icon"><Icon size={20}/></div><span>{r.type}</span></div><h3>{r.title}</h3><p>{r.detail}</p><a href={r.url} target="_blank" rel="noreferrer">Explore resource <ExternalLink size={15}/></a></article>})}</div></>
}
function EmptyState({text}) { return <div className="empty-state"><div><CircleHelp size={20}/></div><p>{text}</p></div> }

function Modal({type,onClose,onTask,onEvent}) {
  const isTask = type==='task'
  const [title,setTitle] = useState('')
  const [course,setCourse] = useState(isTask?'Modern Frontend Frameworks':'')
  const [date,setDate] = useState('2026-11-07')
  const [priority,setPriority] = useState('Medium')
  const [category,setCategory] = useState('Workshop')
  const [time,setTime] = useState('10:00 AM')
  const [place,setPlace] = useState('')
  const submit = e => {
    e.preventDefault()
    if (!title.trim()) return
    if (isTask) onTask({title:title.trim(),course:course.trim()||'General',date,priority})
    else onEvent({title:title.trim(),category,date,time,place:place.trim()||'Campus'})
  }
  return <div className="modal-backdrop" onMouseDown={e=>e.target===e.currentTarget&&onClose()}><form className="modal" onSubmit={submit}><div className="modal-head"><div><span>{isTask?'YOUR PLANNER':'CAMPUS CALENDAR'}</span><h2>{isTask?'Create a task':'Add campus event'}</h2></div><button type="button" className="icon-btn" onClick={onClose}><X size={19}/></button></div><label className="form-field"><span>{isTask?'Task title':'Event name'}</span><input autoFocus required value={title} onChange={e=>setTitle(e.target.value)} placeholder={isTask?'e.g. Finish project report':'e.g. Tech fest'}/></label>{isTask?<><label className="form-field"><span>Course / category</span><input value={course} onChange={e=>setCourse(e.target.value)} placeholder="Subject or category"/></label><div className="form-two"><label className="form-field"><span>Due date</span><input type="date" value={date} onChange={e=>setDate(e.target.value)} required/></label><label className="form-field"><span>Priority</span><select value={priority} onChange={e=>setPriority(e.target.value)}><option>Low</option><option>Medium</option><option>High</option></select></label></div></>:<><div className="form-two"><label className="form-field"><span>Date</span><input type="date" value={date} onChange={e=>setDate(e.target.value)} required/></label><label className="form-field"><span>Category</span><select value={category} onChange={e=>setCategory(e.target.value)}><option>Workshop</option><option>Competition</option><option>Seminar</option></select></label></div><div className="form-two"><label className="form-field"><span>Time</span><input value={time} onChange={e=>setTime(e.target.value)}/></label><label className="form-field"><span>Location</span><input value={place} onChange={e=>setPlace(e.target.value)} placeholder="Campus venue"/></label></div></>}<div className="modal-actions"><button type="button" className="secondary-btn" onClick={onClose}>Cancel</button><button className="primary-btn" type="submit"><Plus size={16}/>{isTask?'Add task':'Add event'}</button></div></form></div>
}

export default App