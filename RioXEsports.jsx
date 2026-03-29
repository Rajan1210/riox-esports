import { useState, useCallback, useEffect } from "react";
import { Home, Trophy, Wallet, User, Bell, Copy, Clock, Upload, Search, LogOut,
  Gamepad2, X, Eye, MessageSquare, Gift, Phone, Lock, BadgeCheck, Download,
  ChevronDown, ChevronRight, ChevronUp, Menu, Swords, DollarSign, Activity,
  AlertTriangle, KeyRound, CreditCard, EyeOff, CheckCircle, XCircle, Users,
  BarChart2, Settings, TrendingUp } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, LineChart, Line } from "recharts";

// ══════════════════════════════════════════════════════════════════
//  SERVER STATE  (module-level = persists across renders like a DB)
// ══════════════════════════════════════════════════════════════════
const SESSION_STORE = {};
const genToken = () => Math.random().toString(36).slice(2) + Date.now().toString(36);
const genUID   = () => "#RX" + Array.from({length:4},()=>"ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789"[Math.floor(Math.random()*36)]).join("");
const NOW = Date.now();

const USERS_DB = [
  {id:1,uid:"#RXAB12",name:"Arjun Singh",  phone:"9876543210",email:"arjun@email.com", password:"1234",     avatar:"AS",role:"user",      deposit_bal:500, winning_bal:1200,bonus_bal:50, banned:false,verified:true,iguid:"ArjunFF_Pro",referral:"RXAB12",matches_played:45,total_won:3400,total_deposited:2000,joined:"Jan 2024"},
  {id:2,uid:"#RXCD34",name:"Priya Sharma", phone:"8765432109",email:"priya@email.com", password:"1234",     avatar:"PS",role:"user",      deposit_bal:200, winning_bal:800, bonus_bal:100,banned:false,verified:true,iguid:"PriyaGames", referral:"RXCD34",matches_played:23,total_won:1500,total_deposited:1000,joined:"Feb 2024"},
  {id:3,uid:"#RXEF56",name:"Rahul Verma",  phone:"9988776655",email:"rahul@email.com", password:"1234",     avatar:"RV",role:"user",      deposit_bal:300, winning_bal:0,   bonus_bal:25, banned:false,verified:true,iguid:"RahulKing",  referral:"RXEF56",matches_played:12,total_won:500, total_deposited:800, joined:"Mar 2024"},
  {id:4,uid:"#RXGH78",name:"Sneha Patel",  phone:"7766554433",email:"sneha@email.com", password:"1234",     avatar:"SP",role:"user",      deposit_bal:150, winning_bal:320, bonus_bal:0,  banned:false,verified:true,iguid:"SnehaPro",   referral:"RXGH78",matches_played:8, total_won:800, total_deposited:600, joined:"Apr 2024"},
  {id:99,uid:"#RXADM1",name:"RioX Admin",  phone:"1111111111",email:"admin@riox.gg",  password:"admin123", avatar:"AD",role:"admin",     deposit_bal:0,   winning_bal:0,   bonus_bal:0,  banned:false,verified:true},
  {id:98,uid:"#RXMOD1",name:"RioX Mod",    phone:"2222222222",email:"mod@riox.gg",    password:"mod123",   avatar:"MO",role:"moderator", deposit_bal:0,   winning_bal:0,   bonus_bal:0,  banned:false,verified:true},
];

const MATCHES_DB = [
  {id:"FF101",title:"Free Fire Solo War",  game:"Free Fire",map:"Bermuda",  mode:"Solo",  entry_fee:50, prize_pool:2000, per_kill:10,total_slots:50,filled_slots:4, status:"upcoming",start_time:NOW+20*60000,  room_id:"FF-9921",room_pass:"solo1234", winning_rank_count:5, rank_prizes:[800,500,300,200,100], joined_users:[{userId:1,iguid:"ArjunFF_Pro"},{userId:2,iguid:"PriyaGames"},{userId:3,iguid:"RahulKing"},{userId:4,iguid:"SnehaPro"}],pending_result:null,result:null},
  {id:"BG202",title:"BGMI Squad Rush",     game:"BGMI",     map:"Erangel", mode:"Squad", entry_fee:100,prize_pool:5000, per_kill:20,total_slots:25,filled_slots:3, status:"live",    start_time:NOW-10*60000,  room_id:"BG-4421",room_pass:"squad2024",winning_rank_count:3, rank_prizes:[2500,1500,1000],  joined_users:[{userId:1,iguid:"ArjunFF_Pro"},{userId:2,iguid:"PriyaGames"},{userId:3,iguid:"RahulKing"}],pending_result:{rows:[{rank:1,iguid:"ArjunFF_Pro",userId:1,userName:"Arjun Singh",appUid:"#RXAB12",kills:8,rankPrize:2500,totalPrize:2660,verified:true},{rank:2,iguid:"PriyaGames",userId:2,userName:"Priya Sharma",appUid:"#RXCD34",kills:5,rankPrize:1500,totalPrize:1600,verified:true},{rank:3,iguid:"RahulKing",userId:3,userName:"Rahul Verma",appUid:"#RXEF56",kills:3,rankPrize:1000,totalPrize:1060,verified:true}],proof:"https://placehold.co/500x300/0d1117/00ffff?text=BGMI+Final+Scoreboard",submittedBy:98,submittedByName:"RioX Mod",status:"pending",rejectReason:""},result:null},
  {id:"VL303",title:"Valorant Ranked Cup", game:"Valorant", map:"Bind",    mode:"5v5",   entry_fee:200,prize_pool:10000,per_kill:0, total_slots:10,filled_slots:2, status:"upcoming",start_time:NOW+90*60000,  room_id:null,     room_pass:null,      winning_rank_count:3, rank_prizes:[5000,3000,2000],  joined_users:[{userId:1,iguid:"ArjunFF_Pro"},{userId:2,iguid:"PriyaGames"}],pending_result:null,result:null},
  {id:"FF102",title:"Free Fire Duo Clash", game:"Free Fire",map:"Kalahari",mode:"Duo",   entry_fee:30, prize_pool:800,  per_kill:5, total_slots:50,filled_slots:50,status:"completed",start_time:NOW-2*3600000,room_id:"FFD-4421",room_pass:"duo123",  winning_rank_count:3, rank_prizes:[400,250,150],     joined_users:[{userId:1,iguid:"ArjunFF_Pro"}],pending_result:null,result:{rows:[{rank:1,iguid:"ArjunFF_Pro",userId:1,userName:"Arjun Singh",appUid:"#RXAB12",kills:7,rankPrize:400,totalPrize:435,verified:true}],proof:"https://placehold.co/500x300/0d1117/00ffff?text=Match+Scoreboard",status:"approved"}},
];

const PAYMENTS_DB = [
  {id:1,userId:3,user_name:"Rahul Verma", uid:"#RXEF56",mobile:"9988776655",amount:500, utr:"UTR123456789",date:"Today, 14:32",status:"pending"},
  {id:2,userId:4,user_name:"Sneha Patel", uid:"#RXGH78",mobile:"7766554433",amount:1000,utr:"UTR987654321",date:"Today, 12:18",status:"pending"},
  {id:3,userId:2,user_name:"Priya Sharma",uid:"#RXCD34",mobile:"8765432109",amount:250, utr:"UTR456789123",date:"Today, 10:05",status:"pending"},
];

const DISPUTES_DB = [
  {id:"TK001",userId:1,user:"Arjun Singh", uid:"#RXAB12",subject:"Match result incorrect", desc:"My kills were not counted in BG202. I had 8 kills but result shows 3.",status:"open",    date:"Today",     reply:""},
  {id:"TK002",userId:2,user:"Priya Sharma",uid:"#RXCD34",subject:"Payment not credited",   desc:"Deposited ₹500 via UPI but balance not updated after 2 hours.",        status:"resolved",date:"Yesterday", reply:"Verified and credited. Sorry for the delay!"},
];

const TXN_DB = [
  {id:1,userId:1,type:"win",    desc:"Match FF102 Prize — Rank 1",    amount:435, date:"Yesterday",status:"completed"},
  {id:2,userId:1,type:"deposit",desc:"Added via UPI · UTR 99887766",   amount:500, date:"Jan 14",   status:"completed"},
  {id:3,userId:1,type:"entry",  desc:"Joined BG202 — BGMI Squad Rush", amount:-100,date:"Jan 14",   status:"completed"},
  {id:4,userId:1,type:"bonus",  desc:"Referral Bonus — Priya Sharma",  amount:50,  date:"Jan 12",   status:"completed"},
  {id:5,userId:2,type:"entry",  desc:"Joined FF101 — Free Fire Solo",  amount:-50, date:"Today",    status:"completed"},
];

const PLATFORM = {upi_id:"riox@paytm",referrer_bonus:50,referee_bonus:25,max_bonus_pct:10,room_reveal_mins:15,live_url:"https://youtube.com/live/rioxesports",show_live:true};

// ── Auth ──────────────────────────────────────────────────────────
const authLogin = (phone, pw) => {
  const u=USERS_DB.find(x=>x.phone===phone);
  if(!u)       return {error:"No account found with this number."};
  if(u.banned) return {error:"Account suspended. Contact support."};
  if(u.password!==pw) return {error:"Incorrect password."};
  const token=genToken();
  SESSION_STORE[token]={userId:u.id,valid:true};
  return {user:{...u},token};
};
const authCheck = token => {
  const s=SESSION_STORE[token];
  if(!s||!s.valid) return null;
  const u=USERS_DB.find(x=>x.id===s.userId);
  if(!u||u.banned){if(s)s.valid=false;return null;}
  return {...u,token};
};
const authInvalidate = userId => {
  Object.keys(SESSION_STORE).forEach(tk=>{
    if(SESSION_STORE[tk].userId===userId) SESSION_STORE[tk].valid=false;
  });
};

// ══════════════════════════════════════════════════════════════════
//  GLOBAL STYLES
// ══════════════════════════════════════════════════════════════════
const GS = () => (
  <style>{`
    @import url('https://fonts.googleapis.com/css2?family=Orbitron:wght@400;600;700;900&family=Rajdhani:wght@400;500;600;700&display=swap');
    *{box-sizing:border-box;margin:0;padding:0}
    body{background:#0B0C10;color:#e0e0e0;font-family:'Rajdhani',sans-serif;overflow-x:hidden}
    .orb{font-family:'Orbitron',monospace}
    .glass  {background:rgba(255,255,255,0.028);backdrop-filter:blur(18px);border:1px solid rgba(0,255,255,0.1);border-radius:16px}
    .glass-g{background:rgba(40,167,69,0.05);backdrop-filter:blur(16px);border:1px solid rgba(40,167,69,0.2);border-radius:16px}
    .glass-p{background:rgba(162,0,255,0.05);backdrop-filter:blur(16px);border:1px solid rgba(162,0,255,0.18);border-radius:16px}
    .glass-y{background:rgba(255,193,7,0.05);backdrop-filter:blur(16px);border:1px solid rgba(255,193,7,0.2);border-radius:16px}
    .glass-r{background:rgba(220,53,69,0.05);backdrop-filter:blur(16px);border:1px solid rgba(220,53,69,0.2);border-radius:16px}
    .acard{background:rgba(255,255,255,0.022);border:1px solid rgba(255,255,255,0.06);border-radius:14px;padding:18px}
    .neon  {color:#00FFFF;text-shadow:0 0 14px rgba(0,255,255,0.6),0 0 30px rgba(0,255,255,0.2)}
    .neon-p{color:#A200FF;text-shadow:0 0 12px rgba(162,0,255,0.6)}
    .neon-g{color:#28a745;text-shadow:0 0 10px rgba(40,167,69,0.5)}
    .neon-y{color:#ffc107;text-shadow:0 0 10px rgba(255,193,7,0.5)}
    .neon-r{color:#dc3545;text-shadow:0 0 10px rgba(220,53,69,0.5)}
    .btn{cursor:pointer;border-radius:10px;font-family:'Rajdhani',sans-serif;font-weight:700;border:none;transition:all .18s;font-size:14px;display:inline-flex;align-items:center;justify-content:center;gap:5px}
    .btn:disabled{opacity:.38;cursor:not-allowed!important;transform:none!important;box-shadow:none!important}
    .bc {background:linear-gradient(135deg,rgba(0,255,255,0.12),rgba(162,0,255,0.07));border:1px solid #00FFFF!important;color:#00FFFF;box-shadow:0 0 12px rgba(0,255,255,0.18)}
    .bc:hover:not(:disabled){box-shadow:0 0 28px rgba(0,255,255,0.5);transform:translateY(-1px)}
    .bp {background:linear-gradient(135deg,#A200FF,#6200CC);color:#fff;box-shadow:0 0 16px rgba(162,0,255,0.3)}
    .bp:hover:not(:disabled){box-shadow:0 0 32px rgba(162,0,255,0.6);transform:translateY(-1px)}
    .bg {background:linear-gradient(135deg,#28a745,#1e7e34);color:#fff}
    .bg:hover:not(:disabled){box-shadow:0 0 18px rgba(40,167,69,0.4);transform:translateY(-1px)}
    .br {background:linear-gradient(135deg,#dc3545,#a71d2a);color:#fff}
    .br:hover:not(:disabled){box-shadow:0 0 18px rgba(220,53,69,0.4);transform:translateY(-1px)}
    .by {background:linear-gradient(135deg,#ffc107,#e0a800);color:#000}
    .by:hover:not(:disabled){box-shadow:0 0 18px rgba(255,193,7,0.4);transform:translateY(-1px)}
    .bt {background:linear-gradient(135deg,#20C997,#17a07a);color:#fff}
    .bt:hover:not(:disabled){box-shadow:0 0 18px rgba(32,201,151,0.4);transform:translateY(-1px)}
    .bgh{background:none!important;border:1px solid rgba(255,255,255,0.1)!important;color:#666}
    .bgh:hover:not(:disabled){border-color:rgba(255,255,255,0.22)!important;color:#aaa}
    .chip{padding:6px 14px;border-radius:20px;font-size:12px;font-weight:600;border:1px solid rgba(0,255,255,0.15);color:#484848;background:rgba(255,255,255,0.02);cursor:pointer;transition:all .18s;white-space:nowrap;font-family:'Rajdhani',sans-serif}
    .chip.on{color:#00FFFF;border-color:#00FFFF;background:rgba(0,255,255,0.08);box-shadow:0 0 10px rgba(0,255,255,0.18)}
    .pb{height:5px;background:rgba(255,255,255,0.07);border-radius:3px;overflow:hidden}
    .pbf{height:100%;background:linear-gradient(90deg,#00FFFF,#A200FF);border-radius:3px;transition:width .5s}
    .bdg{display:inline-flex;align-items:center;gap:3px;padding:3px 9px;border-radius:20px;font-size:10px;font-weight:700;font-family:'Orbitron',monospace;letter-spacing:.4px}
    .bc2{background:rgba(0,255,255,0.08);  color:#00FFFF;border:1px solid rgba(0,255,255,0.25)}
    .bg2{background:rgba(40,167,69,0.09);  color:#28a745;border:1px solid rgba(40,167,69,0.25)}
    .br2{background:rgba(220,53,69,0.09);  color:#dc3545;border:1px solid rgba(220,53,69,0.25)}
    .by2{background:rgba(255,193,7,0.09);  color:#ffc107;border:1px solid rgba(255,193,7,0.25)}
    .bp2{background:rgba(162,0,255,0.09);  color:#A200FF;border:1px solid rgba(162,0,255,0.25)}
    .bgold{background:rgba(255,193,7,0.11);color:#ffc107;border:1px solid rgba(255,193,7,0.3)}
    input,textarea,select{background:rgba(255,255,255,0.038)!important;border:1px solid rgba(0,255,255,0.13)!important;border-radius:10px!important;color:#e0e0e0!important;font-family:'Rajdhani',sans-serif!important;font-size:14px!important;outline:none!important;padding:10px 13px!important;width:100%;transition:border .18s!important}
    input:focus,textarea:focus,select:focus{border-color:#00FFFF!important;box-shadow:0 0 10px rgba(0,255,255,0.12)!important}
    input::placeholder,textarea::placeholder{color:#2e2e2e!important}
    input[type=checkbox]{width:auto!important;padding:0!important;margin:0!important;accent-color:#00FFFF}
    input[readonly]{opacity:.62;cursor:default}
    select option{background:#121418;color:#e0e0e0}
    .g2{display:grid;grid-template-columns:1fr 1fr;gap:12px}
    .g3{display:grid;grid-template-columns:1fr 1fr 1fr;gap:10px}
    .row{display:flex;align-items:center;gap:10px}
    .col{display:flex;flex-direction:column;gap:10px}
    .sep{border:none;border-top:1px solid rgba(255,255,255,0.055);margin:12px 0}
    .mbg{position:fixed;inset:0;background:rgba(0,0,0,0.88);z-index:500;display:flex;align-items:center;justify-content:center;padding:16px;animation:fi .15s}
    @keyframes fi{from{opacity:0}to{opacity:1}}
    @keyframes su{from{opacity:0;transform:translateY(18px)}to{opacity:1;transform:translateY(0)}}
    @keyframes bk{0%,100%{opacity:1}50%{opacity:.15}}
    @keyframes sc{from{transform:translateY(-100%)}to{transform:translateY(100vh)}}
    .anim{animation:su .26s ease}
    .ldot{display:inline-block;width:7px;height:7px;background:#dc3545;border-radius:50%;animation:bk 1s infinite;margin-right:5px;flex-shrink:0}
    .upz{border:2px dashed rgba(0,255,255,0.2);border-radius:12px;padding:20px;text-align:center;cursor:pointer;transition:all .18s;background:rgba(0,255,255,0.02)}
    .upz:hover{border-color:#00FFFF;background:rgba(0,255,255,0.04)}
    .av{display:inline-flex;align-items:center;justify-content:center;border-radius:50%;font-family:'Orbitron',monospace;font-weight:700;flex-shrink:0}
    .si{display:flex;align-items:center;gap:11px;padding:10px 13px;border-radius:9px;cursor:pointer;transition:all .18s;color:#484848;font-size:13px;font-weight:500;font-family:'Rajdhani',sans-serif;white-space:nowrap;overflow:hidden;border-left:2px solid transparent}
    .si:hover{background:rgba(255,255,255,0.025);color:#888}
    .si.on{background:rgba(0,255,255,0.065);color:#00FFFF;border-left-color:#00FFFF}
    .tr{padding:13px 18px;border-bottom:1px solid rgba(255,255,255,0.04);transition:background .15s;cursor:pointer}
    .tr:hover{background:rgba(255,255,255,0.018)}
    .tr:last-child{border-bottom:none}
    .hs{-ms-overflow-style:none;scrollbar-width:none}
    .hs::-webkit-scrollbar{display:none}
    ::-webkit-scrollbar{width:3px}::-webkit-scrollbar-track{background:#0B0C10}::-webkit-scrollbar-thumb{background:#222;border-radius:2px}
    .scan{position:fixed;top:0;left:0;right:0;height:1px;background:linear-gradient(transparent,rgba(0,255,255,0.03),transparent);animation:sc 5s linear infinite;pointer-events:none;z-index:9999}
    .ndot{position:absolute;top:1px;right:1px;width:7px;height:7px;background:#dc3545;border-radius:50%;border:1.5px solid #0B0C10}
    .fl{position:fixed;inset:0;background:rgba(0,0,0,0.96);display:flex;flex-direction:column;align-items:center;justify-content:center;z-index:10000;animation:fi .3s;gap:16px;padding:24px;text-align:center}
    .rtbl{width:100%;border-collapse:collapse;font-size:13px}
    .rtbl th{color:#444;font-size:10px;font-family:'Orbitron',monospace;padding:8px 10px;border-bottom:1px solid rgba(255,255,255,0.06);text-align:left}
    .rtbl td{padding:9px 10px;border-bottom:1px solid rgba(255,255,255,0.04);vertical-align:middle}
    .rtbl tr:last-child td{border-bottom:none}
    .rtbl tr.vr{background:rgba(40,167,69,0.035)}
    .rtbl tr.vr td:first-child{border-left:2px solid #28a745}
  `}</style>
);

// ══════════════════════════════════════════════════════════════════
//  ATOMS
// ══════════════════════════════════════════════════════════════════
const Av = ({init,size=38,color="#00FFFF"}) => (
  <div className="av" style={{width:size,height:size,fontSize:size*.33,background:`linear-gradient(135deg,${color}22,${color}09)`,border:`2px solid ${color}2a`}}>{init}</div>
);
const Bdg = ({label,cls="bdg bc2"}) => <span className={cls}>{label}</span>;
const fmt = n => "₹"+Number(n).toLocaleString("en-IN");
const RS  = n => ["st","nd","rd"][n-1]||"th";
const GC  = {"Free Fire":"#FF4500","BGMI":"#00BFFF","Valorant":"#FF4655"};

const Toast = ({msg,type="ok"}) => (
  <div style={{position:"fixed",bottom:24,left:"50%",transform:"translateX(-50%)",background:type==="err"?"rgba(220,53,69,0.96)":"rgba(16,18,24,0.97)",border:`1px solid ${type==="err"?"#dc354544":"rgba(0,255,255,0.2)"}`,color:"#e0e0e0",padding:"11px 20px",borderRadius:10,fontSize:14,zIndex:5000,whiteSpace:"nowrap",animation:"su .22s ease",boxShadow:"0 8px 32px rgba(0,0,0,0.6)"}}>
    {type==="err"?"⚠ ":"✓ "}{msg}
  </div>
);
const Modal = ({title,onClose,children,width=440}) => (
  <div className="mbg" onClick={onClose}>
    <div className="glass anim" style={{width:"100%",maxWidth:width,padding:24,maxHeight:"90vh",overflowY:"auto"}} onClick={e=>e.stopPropagation()}>
      <div className="row" style={{justifyContent:"space-between",marginBottom:18}}>
        <span className="orb" style={{fontSize:15,fontWeight:700,color:"#ffc107"}}>{title}</span>
        <X size={18} style={{color:"#555",cursor:"pointer"}} onClick={onClose}/>
      </div>
      {children}
    </div>
  </div>
);
const LI = ({label,...p}) => <div className="col" style={{gap:4}}>{label&&<label style={{fontSize:11.5,color:"#555",fontFamily:"Rajdhani"}}>{label}</label>}<input {...p}/></div>;
const LS = ({label,children,...p}) => <div className="col" style={{gap:4}}>{label&&<label style={{fontSize:11.5,color:"#555",fontFamily:"Rajdhani"}}>{label}</label>}<select {...p}>{children}</select></div>;

// ══════════════════════════════════════════════════════════════════
//  AUTH SCREEN
// ══════════════════════════════════════════════════════════════════
const AuthScreen = ({onLogin}) => {
  const [step,set]=useState("phone");
  const [phone,setPhone]=useState("");const [otp,setOtp]=useState("");
  const [pw,setPw]=useState("");const [showPw,setShowPw]=useState(false);
  const [form,setForm]=useState({name:"",email:"",password:"",referral:"",age:false});
  const [err,setErr]=useState("");const [loading,setLoading]=useState(false);

  const goPhone=()=>{
    if(phone.length!==10) return setErr("Enter a valid 10-digit mobile number");
    setErr("");const u=USERS_DB.find(u=>u.phone===phone);
    if(u?.banned) return setErr("Account suspended. Contact support.");
    set(u?"pw":"otp");
  };
  const goOtp=()=>{if(otp!=="1234")return setErr("Invalid OTP. Use 1234 for testing.");setErr("");set("signup");};
  const goLogin=()=>{const r=authLogin(phone,pw);if(r.error)return setErr(r.error);onLogin(r.user,r.token);};
  const goSignup=()=>{
    if(!form.name||!form.email||!form.password)return setErr("All required fields must be filled.");
    if(!form.age)return setErr("You must confirm you are 18+ to register.");
    setLoading(true);
    setTimeout(()=>{
      const nu={id:Date.now(),uid:genUID(),name:form.name,email:form.email,phone,password:form.password,
        avatar:form.name.slice(0,2).toUpperCase(),role:"user",deposit_bal:0,winning_bal:0,
        bonus_bal:form.referral?25:0,banned:false,verified:true,iguid:"",
        referral:phone.slice(-4).toUpperCase(),matches_played:0,total_won:0,total_deposited:0,joined:"Today"};
      USERS_DB.push(nu);const token=genToken();
      SESSION_STORE[token]={userId:nu.id,valid:true};
      setLoading(false);onLogin(nu,token);
    },700);
  };
  return(
    <div style={{minHeight:"100vh",background:"#0B0C10",display:"flex",alignItems:"center",justifyContent:"center",padding:20,position:"relative",overflow:"hidden"}}>
      <div style={{position:"absolute",inset:0,background:"radial-gradient(ellipse at 30% 30%,rgba(162,0,255,0.07),transparent 55%),radial-gradient(ellipse at 70% 70%,rgba(0,255,255,0.05),transparent 55%)"}}/>
      <div className="glass anim" style={{width:"100%",maxWidth:400,padding:32,position:"relative"}}>
        <div style={{textAlign:"center",marginBottom:26}}>
          <div className="orb neon" style={{fontSize:30,fontWeight:900,letterSpacing:4}}>RIOX</div>
          <div style={{color:"#A200FF",fontSize:11,letterSpacing:5,fontFamily:"Orbitron",marginTop:2}}>ESPORTS ARENA</div>
          <div style={{width:60,height:2,background:"linear-gradient(90deg,transparent,#00FFFF,#A200FF,transparent)",margin:"12px auto 0"}}/>
        </div>
        {step==="phone"&&<div className="col">
          <div style={{color:"#555",fontSize:13,textAlign:"center"}}>Enter your mobile number to continue</div>
          <div style={{position:"relative"}}>
            <Phone size={14} style={{position:"absolute",left:13,top:"50%",transform:"translateY(-50%)",color:"#444"}}/>
            <input type="tel" maxLength={10} placeholder="10-digit mobile number" value={phone} onChange={e=>setPhone(e.target.value.replace(/\D/g,""))} style={{paddingLeft:"36px!important"}} onKeyDown={e=>e.key==="Enter"&&goPhone()}/>
          </div>
          {err&&<div className="neon-r" style={{fontSize:12}}><AlertTriangle size={12} style={{marginRight:4}}/>{err}</div>}
          <button className="btn bp" style={{padding:"13px 0",marginTop:4}} onClick={goPhone}>CONTINUE →</button>
          <div style={{textAlign:"center",color:"#252525",fontSize:11,marginTop:4}}>Demo: 9876543210 (user) · 1111111111 (admin) · 2222222222 (mod)</div>
        </div>}
        {step==="otp"&&<div className="col">
          <div style={{color:"#555",fontSize:13,textAlign:"center"}}>OTP sent to +91 {phone}</div>
          <div style={{color:"#2a2a2a",fontSize:11,textAlign:"center"}}>(Use 1234 for testing)</div>
          <input type="text" maxLength={4} placeholder="— — — —" value={otp} onChange={e=>setOtp(e.target.value.replace(/\D/g,""))} style={{textAlign:"center",letterSpacing:14,fontSize:22}}/>
          {err&&<div className="neon-r" style={{fontSize:12}}><AlertTriangle size={12} style={{marginRight:4}}/>{err}</div>}
          <button className="btn bp" style={{padding:"13px 0"}} onClick={goOtp}>VERIFY OTP</button>
          <button className="btn bgh" style={{padding:"10px 0"}} onClick={()=>set("phone")}>← Back</button>
        </div>}
        {step==="pw"&&<div className="col">
          <div style={{color:"#555",fontSize:13,textAlign:"center"}}>Welcome back!</div>
          <div style={{position:"relative"}}>
            <Lock size={14} style={{position:"absolute",left:13,top:"50%",transform:"translateY(-50%)",color:"#444"}}/>
            <input type={showPw?"text":"password"} placeholder="Password" value={pw} onChange={e=>setPw(e.target.value)} style={{paddingLeft:"36px!important",paddingRight:"38px!important"}} onKeyDown={e=>e.key==="Enter"&&goLogin()}/>
            <div style={{position:"absolute",right:13,top:"50%",transform:"translateY(-50%)",cursor:"pointer"}} onClick={()=>setShowPw(!showPw)}>
              {showPw?<EyeOff size={14} style={{color:"#555"}}/>:<Eye size={14} style={{color:"#555"}}/>}
            </div>
          </div>
          {err&&<div className="neon-r" style={{fontSize:12}}><AlertTriangle size={12} style={{marginRight:4}}/>{err}</div>}
          <button className="btn bp" style={{padding:"13px 0"}} onClick={goLogin}>LOGIN →</button>
          <button className="btn bgh" style={{padding:"10px 0"}} onClick={()=>set("phone")}>← Back</button>
        </div>}
        {step==="signup"&&<div className="col">
          <div style={{color:"#555",fontSize:13,textAlign:"center"}}>Create your account</div>
          <input placeholder="Full Name *" value={form.name} onChange={e=>setForm({...form,name:e.target.value})}/>
          <input type="email" placeholder="Email Address *" value={form.email} onChange={e=>setForm({...form,email:e.target.value})}/>
          <input type="password" placeholder="Create Password *" value={form.password} onChange={e=>setForm({...form,password:e.target.value})}/>
          <input placeholder="Referral Code (optional)" value={form.referral} onChange={e=>setForm({...form,referral:e.target.value})}/>
          <label className="row" style={{cursor:"pointer",color:"#666",fontSize:13,alignItems:"flex-start",gap:8}}>
            <input type="checkbox" checked={form.age} onChange={e=>setForm({...form,age:e.target.checked})}/>
            I confirm I am 18+ and agree to the Terms of Service *
          </label>
          {err&&<div className="neon-r" style={{fontSize:12}}><AlertTriangle size={12} style={{marginRight:4}}/>{err}</div>}
          <button className="btn bp" style={{padding:"13px 0",marginTop:4}} onClick={goSignup} disabled={loading}>{loading?"Creating Account...":"CREATE ACCOUNT 🚀"}</button>
          <button className="btn bgh" style={{padding:"10px 0"}} onClick={()=>set("phone")}>← Back</button>
        </div>}
      </div>
    </div>
  );
};

// ══════════════════════════════════════════════════════════════════
//  USER APP TABS
// ══════════════════════════════════════════════════════════════════
const HomeTab = ({user,setUser}) => {
  const [filter,setFilter]=useState("All");
  const [joinM,setJoinM]=useState(null);const [iguid,setIguid]=useState("");const [err,setErr]=useState("");
  const [matches,setMatches]=useState([...MATCHES_DB]);
  useEffect(()=>{const iv=setInterval(()=>setMatches([...MATCHES_DB]),3000);return()=>clearInterval(iv);},[]);
  const visible=matches.filter(m=>m.status!=="completed"&&(filter==="All"||m.game===filter));
  const confirmJoin=()=>{
    if(!iguid.trim())return setErr("Enter your In-Game UID");
    const f=USERS_DB.find(u=>u.id===user.id);
    if((f.deposit_bal+f.winning_bal+f.bonus_bal)<joinM.entry_fee)return setErr("Insufficient balance! Please add funds.");
    let rem=joinM.entry_fee;
    const bUse=Math.min(f.bonus_bal,Math.floor(joinM.entry_fee*(PLATFORM.max_bonus_pct/100)));
    rem-=bUse;f.bonus_bal-=bUse;
    if(rem<=f.deposit_bal){f.deposit_bal-=rem;}else{rem-=f.deposit_bal;f.deposit_bal=0;f.winning_bal-=rem;}
    setUser({...f,token:user.token});
    const mi=MATCHES_DB.findIndex(x=>x.id===joinM.id);
    if(mi>=0){MATCHES_DB[mi].joined_users.push({userId:user.id,iguid});MATCHES_DB[mi].filled_slots++;}
    TXN_DB.unshift({id:Date.now(),userId:user.id,type:"entry",desc:`Joined ${joinM.id} — ${joinM.title}`,amount:-joinM.entry_fee,date:"Today",status:"completed"});
    setJoinM(null);setMatches([...MATCHES_DB]);
  };
  return(
    <div style={{padding:"0 16px 100px"}}>
      {PLATFORM.show_live&&<div className="glass" style={{margin:"16px 0 14px",padding:20,borderColor:"rgba(162,0,255,0.22)",background:"linear-gradient(135deg,rgba(162,0,255,0.08),rgba(0,255,255,0.035))",position:"relative",overflow:"hidden",textAlign:"center"}}>
        <div style={{position:"absolute",inset:0,background:"radial-gradient(ellipse at center,rgba(0,255,255,0.03),transparent 70%)"}}/>
        <div className="row" style={{justifyContent:"center",marginBottom:6}}><span className="ldot"/><span style={{fontSize:11,color:"#A200FF",fontFamily:"Orbitron",letterSpacing:3}}>LIVE NOW</span></div>
        <div className="orb neon" style={{fontSize:19,fontWeight:900}}>Valorant Grand Cup 2024</div>
        <div style={{color:"#666",fontSize:13,margin:"4px 0 12px"}}>Prize Pool — ₹10,000 · Finals Ongoing</div>
        <button className="btn bc" style={{padding:"8px 20px",fontSize:13}}>Watch Live →</button>
      </div>}
      <div className="hs row" style={{overflowX:"auto",marginBottom:14,paddingBottom:4,gap:8}}>
        {["All","Free Fire","BGMI","Valorant"].map(g=><span key={g} className={`chip ${filter===g?"on":""}`} onClick={()=>setFilter(g)} style={filter===g?{borderColor:GC[g]||"#00FFFF",color:GC[g]||"#00FFFF"}:{}}>{g}</span>)}
      </div>
      {visible.length===0&&<div style={{textAlign:"center",color:"#282828",padding:"40px 0"}}>No active matches for {filter}</div>}
      {visible.map(m=>{
        const pct=(m.filled_slots/m.total_slots)*100;const joined=m.joined_users.some(j=>j.userId===user.id);
        const full=m.filled_slots>=m.total_slots;const col=GC[m.game]||"#00FFFF";
        return(
          <div key={m.id} className="glass anim" style={{padding:16,marginBottom:14,borderColor:col+"1e",position:"relative",overflow:"hidden"}}>
            <div style={{position:"absolute",top:0,left:0,right:0,height:2,background:`linear-gradient(90deg,transparent,${col},transparent)`}}/>
            <div className="row" style={{justifyContent:"space-between",marginBottom:10,alignItems:"flex-start"}}>
              <div><div className="orb" style={{fontSize:13,fontWeight:700,color:col}}>{m.title}</div><div style={{color:"#3e3e3e",fontSize:11,marginTop:2}}>{m.map} · {m.mode} · {m.id}</div></div>
              <Bdg label={m.status==="live"?"🔴 LIVE":m.status==="upcoming"?"UPCOMING":"DONE"} cls={`bdg ${m.status==="live"?"br2":m.status==="upcoming"?"by2":"bg2"}`}/>
            </div>
            <div className="g2" style={{marginBottom:10}}>
              <div style={{background:"rgba(0,255,255,0.035)",borderRadius:8,padding:"8px 10px",textAlign:"center"}}><div style={{fontSize:10,color:"#383838"}}>ENTRY FEE</div><div className="neon orb" style={{fontSize:15,fontWeight:700}}>{fmt(m.entry_fee)}</div></div>
              <div style={{background:"rgba(162,0,255,0.035)",borderRadius:8,padding:"8px 10px",textAlign:"center"}}><div style={{fontSize:10,color:"#383838"}}>PRIZE POOL</div><div className="neon-p orb" style={{fontSize:15,fontWeight:700}}>{fmt(m.prize_pool)}</div></div>
            </div>
            {m.per_kill>0&&<div style={{fontSize:11,color:"#ffc107",marginBottom:8}}>🎯 Per Kill: {fmt(m.per_kill)}</div>}
            <div className="pb" style={{marginBottom:5}}><div className="pbf" style={{width:pct+"%"}}/></div>
            <div className="row" style={{justifyContent:"space-between",marginBottom:12}}>
              <span style={{fontSize:11,color:"#383838"}}>{m.filled_slots}/{m.total_slots} slots</span>
              <span style={{fontSize:11,color:full?"#dc3545":"#28a745"}}>{full?"FULL":`${m.total_slots-m.filled_slots} left`}</span>
            </div>
            {m.status==="upcoming"&&<button className={`btn ${joined?"bg":full?"bgh":"bc"}`} style={{width:"100%",padding:"10px 0"}} onClick={()=>!joined&&!full&&(setJoinM(m),setIguid(""),setErr(""))} disabled={full&&!joined}>{joined?"✅ Best of Luck!":full?"MATCH FULL":"JOIN NOW →"}</button>}
            {m.status==="live"&&<button className="btn br" style={{width:"100%",padding:"10px 0",cursor:"default"}}>🔴 MATCH IN PROGRESS</button>}
          </div>
        );
      })}
      {joinM&&<Modal title="Confirm Registration" onClose={()=>setJoinM(null)} width={380}>
        <div className="glass" style={{padding:12,marginBottom:14,borderColor:"rgba(162,0,255,0.2)"}}>
          <div style={{fontWeight:700}}>{joinM.title}</div>
          <div className="row" style={{marginTop:6,fontSize:13,gap:16}}><span>Entry: <span className="neon">{fmt(joinM.entry_fee)}</span></span><span>Pool: <span className="neon-p">{fmt(joinM.prize_pool)}</span></span></div>
        </div>
        <LI label="Your In-Game UID *" placeholder="e.g. ArjunFF_Pro" value={iguid} onChange={e=>setIguid(e.target.value)}/>
        {err&&<div className="neon-r" style={{fontSize:12,marginTop:8}}><AlertTriangle size={12} style={{marginRight:4}}/>{err}</div>}
        <div className="g2" style={{marginTop:14}}>
          <button className="btn bgh" style={{padding:"11px 0"}} onClick={()=>setJoinM(null)}>Cancel</button>
          <button className="btn bp" style={{padding:"11px 0"}} onClick={confirmJoin}>Confirm →</button>
        </div>
      </Modal>}
    </div>
  );
};

const MyMatchesTab = ({user}) => {
  const [proofM,setProofM]=useState(null);
  const matches=[...MATCHES_DB];
  const mine=matches.filter(m=>m.joined_users.some(j=>j.userId===user.id));
  const canRoom=m=>(NOW-m.start_time)>=-PLATFORM.room_reveal_mins*60000;
  return(
    <div style={{padding:"16px 16px 100px"}}>
      {mine.length===0&&<div style={{textAlign:"center",color:"#282828",padding:"60px 0"}}><Gamepad2 size={48} style={{color:"#141414",display:"block",margin:"0 auto 12px"}}/>No matches joined yet</div>}
      {mine.filter(m=>m.status!=="completed").length>0&&<>
        <div className="orb" style={{fontSize:10,color:"#3e3e3e",letterSpacing:3,marginBottom:12}}>UPCOMING / LIVE</div>
        {mine.filter(m=>m.status!=="completed").map(m=>{
          const col=GC[m.game]||"#00FFFF";
          return(<div key={m.id} className="glass anim" style={{padding:18,marginBottom:14,borderColor:col+"1a"}}>
            <div className="row" style={{justifyContent:"space-between",marginBottom:8}}>
              <div><div className="orb" style={{fontSize:13,fontWeight:700,color:col}}>{m.title}</div><div style={{fontSize:11,color:"#3e3e3e",marginTop:2}}>{m.id} · {m.map} · {m.mode}</div></div>
              <Bdg label={m.status==="live"?"🔴 LIVE":"UPCOMING"} cls={`bdg ${m.status==="live"?"br2":"by2"}`}/>
            </div>
            {m.room_id&&canRoom(m)?
              <div className="glass-g" style={{padding:14,borderRadius:12}}>
                <div className="orb" style={{fontSize:9,color:"#28a745",marginBottom:10,letterSpacing:2}}>🔓 ROOM UNLOCKED</div>
                {[["Room ID",m.room_id],["Password",m.room_pass]].map(([l,v])=>(
                  <div key={l} className="row" style={{justifyContent:"space-between",marginBottom:8}}>
                    <span style={{color:"#555",fontSize:13}}>{l}:</span>
                    <div className="row" style={{gap:8}}><span className="orb neon" style={{fontSize:14}}>{v}</span><Copy size={13} style={{color:"#00FFFF",cursor:"pointer"}} onClick={()=>navigator.clipboard?.writeText(v)}/></div>
                  </div>
                ))}
                <button className="btn bg" style={{width:"100%",padding:"10px 0",marginTop:8}}>🎮 Open Game</button>
              </div>:
              <div className="glass" style={{padding:12,textAlign:"center"}}><Clock size={15} style={{color:"#ffc107"}}/><div style={{color:"#383838",fontSize:12,marginTop:4}}>Room details unlock {PLATFORM.room_reveal_mins} mins before start</div></div>
            }
          </div>);
        })}
      </>}
      {mine.filter(m=>m.status==="completed").length>0&&<>
        <div className="orb" style={{fontSize:10,color:"#3e3e3e",letterSpacing:3,margin:"20px 0 12px"}}>COMPLETED</div>
        {mine.filter(m=>m.status==="completed").map(m=>{
          const myRow=m.result?.rows.find(r=>r.userId===user.id);
          return(<div key={m.id} className="glass anim" style={{padding:18,marginBottom:14,borderColor:"rgba(40,167,69,0.15)"}}>
            <div className="row" style={{justifyContent:"space-between",marginBottom:12}}>
              <div className="orb" style={{fontSize:13,fontWeight:700,color:"#28a745"}}>{m.title}</div>
              <Bdg label="COMPLETED" cls="bdg bg2"/>
            </div>
            {myRow?<div className="g3" style={{marginBottom:12}}>
              {[["RANK","#"+myRow.rank,"#ffc107"],["KILLS",myRow.kills,"#dc3545"],["EARNED",fmt(myRow.totalPrize),"#28a745"]].map(([l,v,c])=>(
                <div key={l} style={{textAlign:"center",background:`${c}0a`,borderRadius:8,padding:10}}>
                  <div style={{fontSize:10,color:"#383838"}}>{l}</div>
                  <div className="orb" style={{fontSize:l==="EARNED"?13:18,fontWeight:900,color:c,marginTop:2}}>{v}</div>
                </div>
              ))}
            </div>:<div style={{color:"#383838",fontSize:13,marginBottom:12}}>Result pending.</div>}
            {m.result?.proof&&<button className="btn bc" style={{width:"100%",padding:"9px 0",fontSize:13}} onClick={()=>setProofM(m)}>📸 View Match Proof</button>}
          </div>);
        })}
      </>}
      {proofM&&<Modal title={`${proofM.title} — Scoreboard`} onClose={()=>setProofM(null)} width={520}>
        <img src={proofM.result.proof} alt="scoreboard" style={{width:"100%",borderRadius:10,border:"1px solid rgba(0,255,255,0.2)"}}/>
      </Modal>}
    </div>
  );
};

const LeaderboardTab = () => {
  const [period,setPeriod]=useState("weekly");const [metric,setMetric]=useState("earnings");
  const LB=[
    {rank:1,name:"xX_KingSlayer_Xx",uid:"#RX1234",earnings:45000,kills:892,wins:67,avatar:"KS"},
    {rank:2,name:"ProGamerIndia",uid:"#RX5678",earnings:38000,kills:754,wins:54,avatar:"PG"},
    {rank:3,name:"FireQueen99",uid:"#RX9012",earnings:31500,kills:621,wins:43,avatar:"FQ"},
    {rank:4,name:"StealthNinja",uid:"#RXMN12",earnings:24000,kills:534,wins:38,avatar:"SN"},
    {rank:5,name:"RushB_Always",uid:"#RXOP34",earnings:18500,kills:489,wins:29,avatar:"RB"},
    {rank:6,name:"Arjun Singh",uid:"#RXAB12",earnings:3400,kills:234,wins:12,avatar:"AS"},
    {rank:7,name:"SnipeKing007",uid:"#RXQR56",earnings:2900,kills:198,wins:9,avatar:"SK"},
  ];
  const top3=LB.slice(0,3);const rest=LB.slice(3);
  const PC=["#FFD700","#C0C0C0","#CD7F32"];const HT=[140,175,110];
  return(
    <div style={{padding:"16px 16px 100px"}}>
      <div className="hs row" style={{overflowX:"auto",marginBottom:20,gap:8,paddingBottom:4}}>
        {["weekly","monthly","alltime"].map(p=><span key={p} className={`chip ${period===p?"on":""}`} onClick={()=>setPeriod(p)}>{p==="alltime"?"All Time":p[0].toUpperCase()+p.slice(1)}</span>)}
        <div style={{width:1,background:"rgba(255,255,255,0.07)",margin:"0 4px"}}/>
        {["earnings","kills","wins"].map(m=><span key={m} className={`chip ${metric===m?"on":""}`} onClick={()=>setMetric(m)}>{m[0].toUpperCase()+m.slice(1)}</span>)}
      </div>
      <div className="row" style={{alignItems:"flex-end",justifyContent:"center",gap:12,marginBottom:26,padding:"0 8px"}}>
        {[1,0,2].map((i,pos)=>{const p=top3[i];const c=PC[i];const h=HT[pos];return(
          <div key={i} style={{flex:1,display:"flex",flexDirection:"column",alignItems:"center",maxWidth:120}}>
            <div style={{fontSize:pos===1?26:20}}>{["🥇","🥈","🥉"][i]}</div>
            <Av init={p.avatar} size={pos===1?50:40} color={c}/>
            <div style={{fontFamily:"Orbitron",fontSize:11,color:c,margin:"5px 0 5px",textAlign:"center",wordBreak:"break-all"}}>{p.name.split("_")[0]}</div>
            <div style={{width:"100%",height:h,background:`linear-gradient(180deg,${c}38,${c}0e)`,borderRadius:"8px 8px 0 0",border:`1px solid ${c}28`,borderBottom:"none",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"flex-start",paddingTop:10}}>
              <div className="orb" style={{fontSize:pos===1?14:12,fontWeight:900,color:c}}>{metric==="earnings"?fmt(p.earnings):metric==="kills"?p.kills:p.wins}</div>
              <div style={{fontSize:9,color:"#383838",marginTop:2}}>{metric}</div>
            </div>
          </div>
        );})}
      </div>
      <div className="glass" style={{padding:0,overflow:"hidden"}}>
        {rest.map(p=>(
          <div key={p.rank} className="row tr" style={{cursor:"default"}}>
            <div className="orb" style={{fontSize:12,color:"#383838",width:26}}>#{p.rank}</div>
            <Av init={p.avatar} size={34} color="#00FFFF"/>
            <div style={{flex:1}}><div style={{fontSize:14,fontWeight:600}}>{p.name}</div><div style={{fontSize:10,color:"#383838",fontFamily:"Orbitron"}}>{p.uid}</div></div>
            <div style={{textAlign:"right"}}><div className="neon orb" style={{fontSize:14,fontWeight:700}}>{metric==="earnings"?fmt(p.earnings):metric==="kills"?p.kills:p.wins}</div><div style={{fontSize:10,color:"#383838"}}>{metric}</div></div>
          </div>
        ))}
      </div>
    </div>
  );
};

const WalletTab = ({user,setUser}) => {
  const [view,setView]=useState("main");const [amt,setAmt]=useState("");const [utr,setUtr]=useState("");
  const [uploaded,setUploaded]=useState(false);const [err,setErr]=useState("");const [ok,setOk]=useState("");
  const txns=TXN_DB.filter(t=>t.userId===user.id);
  const fresh=USERS_DB.find(u=>u.id===user.id)||user;
  const total=fresh.deposit_bal+fresh.winning_bal+fresh.bonus_bal;
  const submitDep=()=>{
    if(!amt||+amt<50)return setErr("Minimum deposit is ₹50");
    if(!utr||utr.length<6)return setErr("Enter a valid UTR number");
    if(!uploaded)return setErr("Upload payment screenshot to proceed");
    if(PAYMENTS_DB.some(p=>p.utr===utr))return setErr("This UTR has already been submitted.");
    PAYMENTS_DB.unshift({id:Date.now(),userId:user.id,user_name:user.name,uid:user.uid,mobile:user.phone,amount:+amt,utr,date:"Today",status:"pending"});
    TXN_DB.unshift({id:Date.now(),userId:user.id,type:"pending",desc:`Deposit Request · UTR ${utr}`,amount:+amt,date:"Today",status:"pending"});
    setOk("Submitted! Awaiting admin approval.");setAmt("");setUtr("");setUploaded(false);setErr("");
  };
  const tIcon=t=>t.type==="win"?"🏆":t.type==="deposit"?"💰":t.type==="entry"?"🎮":t.type==="bonus"?"🎁":"⏳";
  const tCol=t=>t.type==="win"||t.type==="deposit"?"#28a745":t.type==="entry"?"#dc3545":t.type==="bonus"?"#A200FF":"#ffc107";
  return(
    <div style={{padding:"16px 16px 100px"}}>
      <div className="glass" style={{padding:20,marginBottom:14,textAlign:"center",background:"linear-gradient(135deg,rgba(0,255,255,0.04),rgba(162,0,255,0.025))"}}>
        <div style={{fontSize:11,color:"#383838",fontFamily:"Orbitron",letterSpacing:3}}>TOTAL BALANCE</div>
        <div className="orb neon" style={{fontSize:34,fontWeight:900,margin:"6px 0"}}>{fmt(total)}</div>
      </div>
      <div className="g3" style={{marginBottom:18}}>
        {[{l:"WINNING",k:"winning_bal",cls:"glass-g",c:"#28a745",note:"Withdrawable"},{l:"DEPOSIT",k:"deposit_bal",cls:"glass",c:"#00FFFF",note:"Refundable"},{l:"BONUS",k:"bonus_bal",cls:"glass-p",c:"#A200FF",note:"Non-withdraw"}].map(w=>(
          <div key={w.k} className={w.cls} style={{padding:"12px 8px",textAlign:"center"}}>
            <div style={{fontSize:9,fontFamily:"Orbitron",color:"#383838",letterSpacing:1}}>{w.l}</div>
            <div className="orb" style={{fontSize:15,fontWeight:800,color:w.c,margin:"4px 0"}}>{fmt(fresh[w.k])}</div>
            <div style={{fontSize:9,color:"#2a2a2a"}}>{w.note}</div>
          </div>
        ))}
      </div>
      <div className="g2" style={{marginBottom:22}}>
        <button className="btn bc" style={{padding:"12px 0"}} onClick={()=>{setView("add");setOk("");setErr("")}}>+ Add Money</button>
        <button className="btn bp" style={{padding:"12px 0"}} onClick={()=>setView("history")}>📋 History</button>
      </div>
      {view==="add"&&<div className="glass anim" style={{padding:20,marginBottom:14}}>
        <div className="row" style={{justifyContent:"space-between",marginBottom:16}}>
          <div className="orb neon" style={{fontSize:14}}>Add Money</div>
          <X size={18} style={{color:"#555",cursor:"pointer"}} onClick={()=>setView("main")}/>
        </div>
        {ok?<div className="glass-g" style={{padding:14,textAlign:"center",borderRadius:12}}>
          <CheckCircle size={24} style={{color:"#28a745",display:"block",margin:"0 auto 8px"}}/><div className="neon-g" style={{fontWeight:600}}>{ok}</div>
        </div>:<div className="col">
          <div style={{background:"rgba(0,255,255,0.04)",borderRadius:10,padding:12,textAlign:"center"}}>
            <div style={{fontSize:11,color:"#383838"}}>Pay to UPI</div>
            <div className="orb neon" style={{fontSize:16,marginTop:2}}>{PLATFORM.upi_id}</div>
          </div>
          <input type="number" placeholder="Amount (min ₹50)" value={amt} onChange={e=>setAmt(e.target.value)}/>
          <input placeholder="UTR / Transaction Reference" value={utr} onChange={e=>setUtr(e.target.value)}/>
          <div className={`upz ${uploaded?"glass-g":""}`} onClick={()=>setUploaded(!uploaded)}>
            {uploaded?<><CheckCircle size={18} style={{color:"#28a745",display:"block",margin:"0 auto 5px"}}/><div style={{color:"#28a745",fontSize:13}}>Screenshot Uploaded ✓</div></>:
              <><Upload size={18} style={{color:"#555",display:"block",margin:"0 auto 5px"}}/><div style={{color:"#555",fontSize:13}}>Upload Payment Screenshot</div></>}
          </div>
          {err&&<div className="neon-r" style={{fontSize:12}}><AlertTriangle size={12} style={{marginRight:4}}/>{err}</div>}
          <button className="btn bc" style={{padding:"12px 0"}} onClick={submitDep}>Submit Request →</button>
        </div>}
      </div>}
      {view==="history"&&<div className="anim">
        <div className="row" style={{justifyContent:"space-between",marginBottom:12}}>
          <div className="orb" style={{fontSize:10,color:"#444",letterSpacing:2}}>TRANSACTIONS</div>
          <X size={18} style={{color:"#555",cursor:"pointer"}} onClick={()=>setView("main")}/>
        </div>
        <div className="glass" style={{padding:0,overflow:"hidden"}}>
          {txns.length===0&&<div style={{padding:24,textAlign:"center",color:"#2a2a2a"}}>No transactions yet</div>}
          {txns.map((t,i)=>(
            <div key={t.id} className="row" style={{padding:"13px 16px",borderBottom:i<txns.length-1?"1px solid rgba(255,255,255,0.04)":"none"}}>
              <div style={{fontSize:20}}>{tIcon(t)}</div>
              <div style={{flex:1}}><div style={{fontSize:13,fontWeight:600}}>{t.desc}</div><div style={{fontSize:11,color:"#3a3a3a",marginTop:2}}>{t.date}</div></div>
              <div style={{textAlign:"right"}}>
                <div className="orb" style={{fontSize:14,fontWeight:700,color:tCol(t)}}>{t.amount>0?"+":""}{fmt(t.amount)}</div>
                <div style={{fontSize:10,color:t.status==="completed"?"#28a745":"#ffc107"}}>{t.status}</div>
              </div>
            </div>
          ))}
        </div>
      </div>}
    </div>
  );
};

const ProfileTab = ({user,onLogout}) => {
  const [supportOpen,setSupportOpen]=useState(false);const [issue,setIssue]=useState({subject:"",desc:""});
  const [issueSent,setIssueSent]=useState(false);const [copied,setCopied]=useState(false);
  const fresh=USERS_DB.find(u=>u.id===user.id)||user;
  const copyRef=()=>{navigator.clipboard?.writeText(fresh.referral);setCopied(true);setTimeout(()=>setCopied(false),2000);};
  const submitIssue=()=>{
    if(!issue.subject||!issue.desc)return;
    DISPUTES_DB.unshift({id:"TK"+Date.now(),userId:user.id,user:user.name,uid:user.uid,subject:issue.subject,desc:issue.desc,status:"open",date:"Today",reply:""});
    setIssueSent(true);
  };
  return(
    <div style={{padding:"16px 16px 100px"}}>
      <div className="glass" style={{padding:20,marginBottom:14,background:"linear-gradient(135deg,rgba(0,255,255,0.04),rgba(162,0,255,0.025))"}}>
        <div className="row" style={{gap:14,marginBottom:14}}>
          <div style={{position:"relative"}}><Av init={fresh.avatar} size={60} color="#00FFFF"/>
            <BadgeCheck size={16} style={{position:"absolute",bottom:-2,right:-2,color:"#28a745",background:"#0B0C10",borderRadius:"50%",padding:1}}/>
          </div>
          <div style={{flex:1}}>
            <div className="orb" style={{fontSize:18,fontWeight:700}}>{fresh.name}</div>
            <div className="neon orb" style={{fontSize:12}}>{fresh.uid}</div>
            <div className="row" style={{marginTop:6,gap:6,flexWrap:"wrap"}}>
              <Bdg label="18+ VERIFIED" cls="bdg bg2"/><Bdg label="ACTIVE" cls="bdg bc2"/>
            </div>
          </div>
        </div>
        <div className="g2">
          {[["PHONE","+91 "+fresh.phone],["EMAIL",fresh.email],["MEMBER SINCE",fresh.joined],["REFERRAL CODE",fresh.referral]].map(([l,v])=>(
            <div key={l} style={{background:"rgba(0,0,0,0.2)",borderRadius:8,padding:"8px 10px"}}>
              <div style={{fontSize:9,color:"#3a3a3a",fontFamily:"Orbitron"}}>{l}</div>
              <div style={{fontSize:12,marginTop:2,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{v}</div>
            </div>
          ))}
        </div>
      </div>
      <div className="g3" style={{marginBottom:14}}>
        {[["Matches",fresh.matches_played,"#00FFFF"],["Won",fmt(fresh.total_won),"#28a745"],["Deposited",fmt(fresh.total_deposited),"#A200FF"]].map(([l,v,c])=>(
          <div key={l} className="glass" style={{padding:"12px 8px",textAlign:"center"}}><div className="orb" style={{fontSize:14,fontWeight:800,color:c}}>{v}</div><div style={{fontSize:10,color:"#383838",marginTop:2}}>{l}</div></div>
        ))}
      </div>
      <div className="glass-y" style={{padding:18,borderRadius:14,marginBottom:14}}>
        <div className="row" style={{gap:8,marginBottom:10}}><Gift size={15} style={{color:"#ffc107"}}/><div className="orb neon-y" style={{fontSize:13,fontWeight:700}}>REFER & EARN</div></div>
        <div style={{fontSize:13,color:"#666",marginBottom:10,lineHeight:1.5}}>Share your code. Earn <span style={{color:"#ffc107"}}>₹{PLATFORM.referrer_bonus}</span> after friend's first deposit!</div>
        <div className="row">
          <div style={{flex:1,background:"rgba(0,0,0,0.3)",borderRadius:8,padding:"10px 14px",fontFamily:"Orbitron",fontSize:16,color:"#ffc107",letterSpacing:2}}>{fresh.referral}</div>
          <button className="btn by" style={{padding:"0 16px",height:42,fontSize:13,whiteSpace:"nowrap"}} onClick={copyRef}><Copy size={13}/>{copied?"Copied!":"Copy"}</button>
        </div>
      </div>
      <div className="glass" style={{padding:18,borderRadius:14,marginBottom:14}}>
        <div className="row" style={{justifyContent:"space-between",cursor:"pointer"}} onClick={()=>setSupportOpen(!supportOpen)}>
          <div className="row" style={{gap:8}}><MessageSquare size={15} style={{color:"#00FFFF"}}/><div style={{fontWeight:700}}>Raise a Support Ticket</div></div>
          {supportOpen?<ChevronUp size={14} style={{color:"#555"}}/>:<ChevronDown size={14} style={{color:"#555"}}/>}
        </div>
        {supportOpen&&<div className="anim col" style={{marginTop:14}}>
          {issueSent?<div className="glass-g" style={{padding:14,textAlign:"center",borderRadius:10}}>
            <CheckCircle size={22} style={{color:"#28a745",display:"block",margin:"0 auto 8px"}}/><div className="neon-g">Ticket submitted! We'll respond within 24 hours.</div>
          </div>:<>
            <input placeholder="Subject" value={issue.subject} onChange={e=>setIssue({...issue,subject:e.target.value})}/>
            <textarea rows={3} placeholder="Describe your issue..." value={issue.desc} onChange={e=>setIssue({...issue,desc:e.target.value})}/>
            <div className="upz"><Upload size={15} style={{color:"#555",display:"block",margin:"0 auto 4px"}}/><div style={{color:"#555",fontSize:12}}>Attach Screenshot (optional)</div></div>
            <button className="btn bc" style={{padding:"11px 0"}} onClick={submitIssue}>Submit Ticket →</button>
          </>}
        </div>}
      </div>
      <button className="btn br" style={{width:"100%",padding:"13px 0",fontSize:15}} onClick={onLogout}><LogOut size={14} style={{marginRight:6}}/>Sign Out</button>
    </div>
  );
};

const UserApp = ({user,setUser,onLogout}) => {
  const [tab,setTab]=useState(0);const [forcedOut,setForcedOut]=useState(false);
  const fresh=USERS_DB.find(u=>u.id===user.id)||user;
  const total=fresh.deposit_bal+fresh.winning_bal+fresh.bonus_bal;
  const TABS=[{I:Home,l:"Home"},{I:Gamepad2,l:"Matches"},{I:Trophy,l:"Leaders"},{I:Wallet,l:"Wallet"},{I:User,l:"Profile"}];
  useEffect(()=>{
    const iv=setInterval(()=>{const c=authCheck(user.token);if(!c){setForcedOut(true);setTimeout(onLogout,2400);}},2000);
    return()=>clearInterval(iv);
  },[user.token]);
  if(forcedOut)return(
    <div className="fl">
      <div style={{width:70,height:70,borderRadius:"50%",background:"rgba(220,53,69,0.15)",border:"2px solid #dc3545",display:"flex",alignItems:"center",justifyContent:"center"}}><XCircle size={36} style={{color:"#dc3545"}}/></div>
      <div className="orb" style={{fontSize:20,fontWeight:900,color:"#dc3545"}}>SESSION TERMINATED</div>
      <div style={{color:"#888",fontSize:14,maxWidth:300}}>Your account status was changed by an administrator. You have been signed out.</div>
    </div>
  );
  return(
    <div style={{minHeight:"100vh",background:"#0B0C10",maxWidth:480,margin:"0 auto",position:"relative"}}>
      <div style={{position:"sticky",top:0,zIndex:100,background:"rgba(11,12,16,0.94)",backdropFilter:"blur(18px)",padding:"11px 16px",borderBottom:"1px solid rgba(0,255,255,0.07)"}}>
        <div className="row" style={{justifyContent:"space-between"}}>
          <div className="row" style={{gap:10}}><Av init={fresh.avatar} size={36} color="#00FFFF"/>
            <div><div style={{fontSize:14,fontWeight:700}}>{fresh.name}</div><div className="neon orb" style={{fontSize:10}}>{fresh.uid}</div></div>
          </div>
          <div className="row" style={{gap:12}}>
            <div style={{textAlign:"right"}}><div style={{fontSize:9,color:"#3a3a3a"}}>BALANCE</div><div className="orb neon" style={{fontSize:14,fontWeight:700}}>{fmt(total)}</div></div>
            <div style={{position:"relative",cursor:"pointer"}}><Bell size={20} style={{color:"#555"}}/><div className="ndot"/></div>
          </div>
        </div>
      </div>
      <div style={{overflowY:"auto",height:"calc(100vh - 58px - 66px)"}}>
        {tab===0&&<HomeTab user={fresh} setUser={setUser}/>}
        {tab===1&&<MyMatchesTab user={fresh}/>}
        {tab===2&&<LeaderboardTab/>}
        {tab===3&&<WalletTab user={fresh} setUser={setUser}/>}
        {tab===4&&<ProfileTab user={fresh} onLogout={onLogout}/>}
      </div>
      <div style={{position:"fixed",bottom:0,left:"50%",transform:"translateX(-50%)",width:"100%",maxWidth:480,background:"rgba(11,12,16,0.97)",backdropFilter:"blur(20px)",borderTop:"1px solid rgba(0,255,255,0.07)",display:"flex",zIndex:200,padding:"8px 0 10px"}}>
        {TABS.map(({I,l},i)=>(
          <button key={i} onClick={()=>setTab(i)} style={{flex:1,background:"none",border:"none",cursor:"pointer",display:"flex",flexDirection:"column",alignItems:"center",gap:3}}>
            <I size={20} style={{color:tab===i?"#00FFFF":"#2e2e2e",filter:tab===i?"drop-shadow(0 0 6px #00FFFF)":"none",transition:"all .18s"}}/>
            <span style={{fontSize:9,color:tab===i?"#00FFFF":"#2e2e2e",fontFamily:"Orbitron",transition:"color .18s"}}>{l}</span>
          </button>
        ))}
      </div>
    </div>
  );
};

// ══════════════════════════════════════════════════════════════════
//  ADMIN PANEL SCREENS
// ══════════════════════════════════════════════════════════════════
const AdminAnalytics = () => {
  const totalU=USERS_DB.filter(u=>u.role==="user").length;
  const activeU=USERS_DB.filter(u=>u.role==="user"&&!u.banned).length;
  const bannedU=USERS_DB.filter(u=>u.role==="user"&&u.banned).length;
  const todayDep=PAYMENTS_DB.filter(p=>p.status!=="rejected").reduce((a,p)=>a+p.amount,0);
  const STATS=[
    {l:"Total Users",v:totalU,I:Users,c:"#00FFFF",s:"Registered"},
    {l:"Active Users",v:activeU,I:Activity,c:"#28a745",s:`${Math.round(activeU/Math.max(1,totalU)*100)}% of total`},
    {l:"Banned Users",v:bannedU,I:XCircle,c:"#dc3545",s:"Suspended"},
    {l:"Deposits Today",v:`₹${todayDep}`,I:TrendingUp,c:"#ffc107",s:"Pending + approved"},
    {l:"Withdrawals",v:"₹67,400",I:Download,c:"#A200FF",s:"Today processed"},
    {l:"Net Revenue",v:"₹1,16,800",I:DollarSign,c:"#20C997",s:"Today's margin"},
  ];
  const CD=[{n:"Mon",dep:4200,wth:1200},{n:"Tue",dep:6800,wth:2100},{n:"Wed",dep:3900,wth:1800},{n:"Thu",dep:8200,wth:3400},{n:"Fri",dep:11000,wth:4200},{n:"Sat",dep:9500,wth:3900},{n:"Sun",dep:7200,wth:2800}];
  return(
    <div style={{padding:24}}>
      <div className="orb" style={{fontSize:18,fontWeight:700,color:"#ffc107",marginBottom:22}}>Analytics Overview</div>
      <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:13,marginBottom:26}}>
        {STATS.map(s=>(
          <div key={s.l} className="acard" style={{borderColor:s.c+"18"}}>
            <div className="row" style={{justifyContent:"space-between",marginBottom:10}}><s.I size={16} style={{color:s.c}}/><span style={{fontSize:10,color:"#3a3a3a"}}>{s.s}</span></div>
            <div className="orb" style={{fontSize:22,fontWeight:900,color:s.c}}>{s.v}</div>
            <div style={{fontSize:11,color:"#555",marginTop:4}}>{s.l}</div>
          </div>
        ))}
      </div>
      <div className="g2" style={{gap:16}}>
        <div className="acard">
          <div className="orb" style={{fontSize:10,color:"#555",marginBottom:12,letterSpacing:1}}>WEEKLY REVENUE</div>
          <ResponsiveContainer width="100%" height={150}>
            <BarChart data={CD} margin={{left:-20}}>
              <XAxis dataKey="n" tick={{fill:"#3a3a3a",fontSize:10}} axisLine={false} tickLine={false}/>
              <YAxis hide/><Tooltip contentStyle={{background:"#1a1d24",border:"1px solid #333",borderRadius:8,fontFamily:"Rajdhani"}} formatter={v=>["₹"+v.toLocaleString()]}/>
              <Bar dataKey="dep" fill="#00FFFF" radius={[3,3,0,0]} opacity={0.75}/>
              <Bar dataKey="wth" fill="#A200FF" radius={[3,3,0,0]} opacity={0.75}/>
            </BarChart>
          </ResponsiveContainer>
          <div className="row" style={{gap:14,marginTop:6,fontSize:11,color:"#3a3a3a"}}><span><span style={{color:"#00FFFF"}}>■</span> Deposits</span><span><span style={{color:"#A200FF"}}>■</span> Withdrawals</span></div>
        </div>
        <div className="acard">
          <div className="orb" style={{fontSize:10,color:"#555",marginBottom:12,letterSpacing:1}}>USER GROWTH</div>
          <ResponsiveContainer width="100%" height={150}>
            <LineChart data={CD.map((d,i)=>({...d,users:11000+i*270}))} margin={{left:-20}}>
              <XAxis dataKey="n" tick={{fill:"#3a3a3a",fontSize:10}} axisLine={false} tickLine={false}/>
              <YAxis hide/><Tooltip contentStyle={{background:"#1a1d24",border:"1px solid #333",borderRadius:8,fontFamily:"Rajdhani"}}/>
              <Line type="monotone" dataKey="users" stroke="#20C997" strokeWidth={2} dot={{fill:"#20C997",r:3}}/>
            </LineChart>
          </ResponsiveContainer>
          <div style={{fontSize:11,color:"#3a3a3a",marginTop:6}}><span style={{color:"#20C997"}}>■</span> Total Users</div>
        </div>
      </div>
    </div>
  );
};

const AdminMatches = ({adminUser}) => {
  const isAdmin=adminUser.role==="admin";
  const [matches,setMatches]=useState([...MATCHES_DB]);
  const [createM,setCreateM]=useState(false);const [resultM,setResultM]=useState(null);
  const [verifyM,setVerifyM]=useState(null);const [rejectM,setRejectM]=useState(null);
  const [rejectReason,setRejectReason]=useState("");
  const [toast,setToast]=useState(null);
  const showToast=(msg,type="ok")=>{setToast({msg,type});setTimeout(()=>setToast(null),2800);};
  const refresh=()=>setMatches([...MATCHES_DB]);

  const BLANK={title:"",game:"Free Fire",map:"",mode:"Solo",entry_fee:"",prize_pool:"",per_kill:"",total_slots:"",winning_rank_count:3,rank_prizes:["","",""]};
  const [mf,setMf]=useState(BLANK);
  const setRC=n=>{const p=Array.from({length:n},(_,i)=>mf.rank_prizes[i]||"");setMf({...mf,winning_rank_count:n,rank_prizes:p});};
  const setRP=(i,v)=>{const p=[...mf.rank_prizes];p[i]=v;setMf({...mf,rank_prizes:p});};

  const createMatch=()=>{
    if(!mf.title||!mf.map||!mf.entry_fee||!mf.prize_pool||!mf.total_slots)return showToast("Fill all required fields","err");
    if(mf.rank_prizes.some(p=>!p||isNaN(p)))return showToast("Enter all rank prize amounts","err");
    const nm={id:mf.game.slice(0,2).toUpperCase()+(Date.now()%10000),title:mf.title,game:mf.game,map:mf.map,mode:mf.mode,
      entry_fee:+mf.entry_fee,prize_pool:+mf.prize_pool,per_kill:+mf.per_kill||0,total_slots:+mf.total_slots,
      filled_slots:0,status:"upcoming",start_time:Date.now()+3600000,room_id:null,room_pass:null,
      winning_rank_count:mf.winning_rank_count,rank_prizes:mf.rank_prizes.map(Number),
      joined_users:[],pending_result:null,result:null};
    MATCHES_DB.unshift(nm);setCreateM(false);setMf(BLANK);refresh();showToast("Match created successfully!");
  };
  const delMatch=id=>{const i=MATCHES_DB.findIndex(m=>m.id===id);if(i>=0)MATCHES_DB.splice(i,1);refresh();showToast("Match deleted");};

  // Mod result submission
  const [rows,setRows]=useState([]);const [proof,setProof]=useState(false);const [rowErr,setRowErr]=useState({});
  const openResult=m=>{
    const ir=Array.from({length:m.winning_rank_count},(_,i)=>({rank:i+1,iguid:"",userId:null,userName:"",appUid:"",kills:"",rankPrize:m.rank_prizes[i]||0,totalPrize:m.rank_prizes[i]||0,verified:false}));
    setRows(ir);setProof(false);setRowErr({});setResultM(m);
  };
  const verifyRow=(idx,m)=>{
    const ig=rows[idx].iguid.trim();
    if(!ig)return setRowErr({...rowErr,[idx]:"Enter In-Game UID first"});
    const entry=m.joined_users.find(j=>j.iguid===ig);
    if(!entry)return setRowErr({...rowErr,[idx]:"Player did not join this match"});
    if(rows.some((r,i)=>i!==idx&&r.userId===entry.userId))return setRowErr({...rowErr,[idx]:"Player already entered in another rank"});
    const ur=USERS_DB.find(u=>u.id===entry.userId);
    if(!ur)return setRowErr({...rowErr,[idx]:"Player record not found"});
    const rp=m.rank_prizes[idx]||0;const k=+rows[idx].kills||0;
    const nr=[...rows];nr[idx]={...nr[idx],userId:ur.id,userName:ur.name,appUid:ur.uid,rankPrize:rp,totalPrize:rp+k*m.per_kill,verified:true};
    const ne={...rowErr};delete ne[idx];setRows(nr);setRowErr(ne);
  };
  const updateKills=(idx,kills,m)=>{
    const nr=[...rows];nr[idx].kills=kills;
    if(nr[idx].verified)nr[idx].totalPrize=nr[idx].rankPrize+(+kills||0)*m.per_kill;
    setRows(nr);
  };
  const submitResult=m=>{
    if(!proof)return showToast("Upload scoreboard screenshot first","err");
    if(rows.some(r=>!r.verified))return showToast("Verify all player UIDs first","err");
    const mi=MATCHES_DB.findIndex(x=>x.id===m.id);
    if(mi>=0)MATCHES_DB[mi].pending_result={rows:rows.map(r=>({...r,kills:+r.kills||0})),
      proof:"https://placehold.co/500x300/0d1117/00ffff?text=Match+Scoreboard+Proof",
      submittedBy:adminUser.id,submittedByName:adminUser.name,status:"pending",rejectReason:""};
    setResultM(null);refresh();showToast("Result submitted for Admin approval!");
  };
  // Admin approve/reject
  const approveResult=m=>{
    const mi=MATCHES_DB.findIndex(x=>x.id===m.id);if(mi<0)return;
    m.pending_result.rows.forEach(r=>{
      if(!r.userId)return;
      const ui=USERS_DB.findIndex(u=>u.id===r.userId);
      if(ui>=0){USERS_DB[ui].winning_bal+=r.totalPrize;
        TXN_DB.unshift({id:Date.now()+r.rank,userId:r.userId,type:"win",desc:`${m.title} — Rank ${r.rank} Prize`,amount:r.totalPrize,date:"Today",status:"completed"});}
    });
    MATCHES_DB[mi].status="completed";MATCHES_DB[mi].result={...m.pending_result,status:"approved"};MATCHES_DB[mi].pending_result=null;
    setVerifyM(null);refresh();showToast("Result approved! Wallets credited.");
  };
  const rejectResult=m=>{
    if(!rejectReason.trim())return showToast("Enter rejection reason","err");
    const mi=MATCHES_DB.findIndex(x=>x.id===m.id);
    if(mi>=0)MATCHES_DB[mi].pending_result={...m.pending_result,status:"rejected",rejectReason};
    setRejectM(null);setVerifyM(null);refresh();showToast("Result rejected. Moderator notified.");
  };
  const pendingM=matches.filter(m=>m.pending_result?.status==="pending");

  return(
    <div style={{padding:24}}>
      <div className="row" style={{justifyContent:"space-between",marginBottom:22}}>
        <div>
          <div className="orb" style={{fontSize:18,fontWeight:700,color:"#ffc107"}}>Tournaments</div>
          {isAdmin&&pendingM.length>0&&<div style={{fontSize:12,color:"#dc3545",marginTop:3}}>⚠ {pendingM.length} result(s) awaiting approval</div>}
        </div>
        <button className="btn bt" style={{padding:"9px 18px",fontSize:13}} onClick={()=>setCreateM(true)}>+ Create Match</button>
      </div>
      {isAdmin&&pendingM.map(m=>(
        <div key={m.id} className="glass-y anim" style={{padding:"12px 16px",marginBottom:14,borderRadius:12,display:"flex",alignItems:"center",justifyContent:"space-between"}}>
          <div><div style={{fontSize:13,fontWeight:700}}><span className="ldot"/>{m.title} — Result Pending</div><div style={{fontSize:11,color:"#777",marginTop:2}}>By {m.pending_result.submittedByName}</div></div>
          <button className="btn by" style={{padding:"7px 14px",fontSize:12}} onClick={()=>setVerifyM(m)}>Review →</button>
        </div>
      ))}
      <div className="glass" style={{padding:0,overflow:"hidden"}}>
        {matches.map((m,i)=>{
          const needsResult=m.status!=="completed"&&!m.pending_result;
          const hasPending=m.pending_result?.status==="pending";
          const wasRejected=m.pending_result?.status==="rejected";
          return(
            <div key={m.id} style={{display:"flex",alignItems:"center",gap:12,padding:"13px 18px",borderBottom:i<matches.length-1?"1px solid rgba(255,255,255,0.04)":"none"}}>
              <div style={{flex:1}}>
                <div style={{fontWeight:700,fontSize:14}}>{m.title}</div>
                <div style={{fontSize:11,color:"#3e3e3e",marginTop:2}}>{m.id} · {m.game} · {m.mode} · Top {m.winning_rank_count}</div>
                <div className="row" style={{marginTop:6,gap:6,flexWrap:"wrap"}}>
                  <Bdg label={m.status.toUpperCase()} cls={`bdg ${m.status==="live"?"br2":m.status==="upcoming"?"by2":"bg2"}`}/>
                  {hasPending&&<Bdg label="RESULT PENDING" cls="bdg by2"/>}
                  {wasRejected&&<Bdg label="RESULT REJECTED" cls="bdg br2"/>}
                  {m.result&&<Bdg label="RESULT APPROVED" cls="bdg bg2"/>}
                </div>
              </div>
              <div className="row" style={{gap:8}}>
                {(needsResult||wasRejected)&&<button className="btn bc" style={{padding:"7px 13px",fontSize:12}} onClick={()=>openResult(m)}>{wasRejected?"Resubmit":"Submit Result"}</button>}
                {isAdmin&&hasPending&&<button className="btn by" style={{padding:"7px 13px",fontSize:12}} onClick={()=>setVerifyM(m)}>Verify</button>}
                <button className="btn br" style={{padding:"7px 10px",fontSize:11}} onClick={()=>delMatch(m.id)}>Del</button>
              </div>
            </div>
          );
        })}
        {matches.length===0&&<div style={{padding:24,textAlign:"center",color:"#2a2a2a"}}>No matches found</div>}
      </div>

      {/* Create Match Modal */}
      {createM&&<Modal title="Create New Tournament" onClose={()=>setCreateM(false)} width={600}>
        <div className="col">
          <div className="g2">
            <LI label="Match Title *" placeholder="e.g. Free Fire Solo War" value={mf.title} onChange={e=>setMf({...mf,title:e.target.value})}/>
            <LS label="Game *" value={mf.game} onChange={e=>setMf({...mf,game:e.target.value})}>
              {["Free Fire","BGMI","Valorant","PUBG Mobile"].map(g=><option key={g}>{g}</option>)}
            </LS>
            <LI label="Map *" placeholder="e.g. Bermuda" value={mf.map} onChange={e=>setMf({...mf,map:e.target.value})}/>
            <LS label="Mode *" value={mf.mode} onChange={e=>setMf({...mf,mode:e.target.value})}>
              {["Solo","Duo","Squad","5v5","Battle Royale"].map(m=><option key={m}>{m}</option>)}
            </LS>
            <LI label="Entry Fee (₹) *" type="number" placeholder="50" value={mf.entry_fee} onChange={e=>setMf({...mf,entry_fee:e.target.value})}/>
            <LI label="Prize Pool (₹) *" type="number" placeholder="2000" value={mf.prize_pool} onChange={e=>setMf({...mf,prize_pool:e.target.value})}/>
            <LI label="Per Kill (₹)" type="number" placeholder="10" value={mf.per_kill} onChange={e=>setMf({...mf,per_kill:e.target.value})}/>
            <LI label="Total Slots *" type="number" placeholder="50" value={mf.total_slots} onChange={e=>setMf({...mf,total_slots:e.target.value})}/>
          </div>
          <hr className="sep"/>
          <LS label="Winning Rank Count *" value={mf.winning_rank_count} onChange={e=>setRC(+e.target.value)}>
            {[3,5,8,10].map(n=><option key={n} value={n}>Top {n}</option>)}
          </LS>
          <div style={{background:"rgba(0,0,0,0.2)",borderRadius:12,padding:14}}>
            <div style={{fontSize:10,color:"#555",fontFamily:"Orbitron",letterSpacing:1,marginBottom:10}}>PRIZE PER RANK</div>
            <div className="col" style={{gap:8}}>
              {Array.from({length:mf.winning_rank_count},(_,i)=>(
                <div key={i} className="row">
                  <div style={{width:90,fontSize:13,color:"#666",fontFamily:"Orbitron",flexShrink:0}}>Rank {i+1}{RS(i+1)}</div>
                  <input type="number" placeholder="₹ Prize" value={mf.rank_prizes[i]||""} onChange={e=>setRP(i,e.target.value)}/>
                </div>
              ))}
            </div>
          </div>
          <button className="btn bt" style={{padding:"13px 0",fontSize:15}} onClick={createMatch}>Create Tournament →</button>
        </div>
      </Modal>}

      {/* Result Submission Modal */}
      {resultM&&<Modal title={`Submit Result — ${resultM.title}`} onClose={()=>setResultM(null)} width={750}>
        <div style={{fontSize:12,color:"#555",marginBottom:14}}>Fill all {resultM.winning_rank_count} rank results. Verify each In-Game UID before submitting.</div>
        {resultM.pending_result?.status==="rejected"&&<div className="glass-r" style={{padding:12,borderRadius:10,marginBottom:14}}>
          <div style={{fontSize:10,color:"#dc3545",fontFamily:"Orbitron",marginBottom:4}}>REJECTION REASON</div>
          <div style={{fontSize:13}}>{resultM.pending_result.rejectReason}</div>
        </div>}
        <div style={{overflowX:"auto",marginBottom:16}}>
          <table className="rtbl" style={{minWidth:600}}>
            <thead><tr><th>RANK</th><th>IN-GAME UID</th><th style={{width:80}}></th><th>PLAYER NAME</th><th>APP UID</th><th style={{width:80}}>KILLS</th><th style={{width:110}}>TOTAL PRIZE</th></tr></thead>
            <tbody>
              {rows.map((row,idx)=>(
                <tr key={idx} className={row.verified?"vr":""}>
                  <td><div className="orb" style={{color:"#ffc107",fontWeight:700}}>#{row.rank}{RS(row.rank)}</div><div style={{fontSize:9,color:"#444"}}>{fmt(row.rankPrize)}</div></td>
                  <td>{row.verified?<div style={{color:"#28a745",fontFamily:"Orbitron",fontSize:12}}>{row.iguid} ✓</div>:
                    <div className="col" style={{gap:3}}>
                      <input placeholder="In-Game UID" value={row.iguid} onChange={e=>{const r=[...rows];r[idx].iguid=e.target.value;setRows(r);const er={...rowErr};delete er[idx];setRowErr(er);}} style={{fontSize:12}}/>
                      {rowErr[idx]&&<div className="neon-r" style={{fontSize:11}}>{rowErr[idx]}</div>}
                    </div>}
                  </td>
                  <td>{!row.verified&&<button className="btn bc" style={{padding:"5px 10px",fontSize:11,width:"100%"}} onClick={()=>verifyRow(idx,resultM)}>Verify</button>}</td>
                  <td><input readOnly value={row.userName} placeholder="Auto-fill" style={{fontSize:12}}/></td>
                  <td><input readOnly value={row.appUid} placeholder="Auto-fill" style={{fontSize:11,fontFamily:"Orbitron",color:"#00FFFF"}}/></td>
                  <td><input type="number" placeholder="0" value={row.kills} onChange={e=>updateKills(idx,e.target.value,resultM)} disabled={!row.verified} style={{fontSize:12}}/></td>
                  <td><div className="neon-g orb" style={{fontSize:13,fontWeight:700}}>{fmt(row.totalPrize)}</div>
                    {resultM.per_kill>0&&row.verified&&<div style={{fontSize:9,color:"#3a3a3a"}}>{fmt(row.rankPrize)}+{+row.kills||0}×{fmt(resultM.per_kill)}</div>}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className={`upz ${proof?"glass-g":""}`} onClick={()=>setProof(!proof)} style={{marginBottom:16}}>
          {proof?<><CheckCircle size={18} style={{color:"#28a745",display:"block",margin:"0 auto 5px"}}/><div style={{color:"#28a745",fontSize:13}}>Scoreboard Screenshot Uploaded ✓</div></>:
            <><Upload size={18} style={{color:"#555",display:"block",margin:"0 auto 5px"}}/><div style={{color:"#555",fontSize:13}}>Upload Final Scoreboard Screenshot (Required)</div></>}
        </div>
        <div className="g2">
          <button className="btn bgh" style={{padding:"12px 0"}} onClick={()=>setResultM(null)}>Cancel</button>
          <button className="btn by" style={{padding:"12px 0"}} disabled={!proof||rows.some(r=>!r.verified)} onClick={()=>submitResult(resultM)}>
            {!proof?"Upload Screenshot First":rows.some(r=>!r.verified)?"Verify All Players":"Submit for Admin Approval →"}
          </button>
        </div>
      </Modal>}

      {/* Admin Verify Modal */}
      {verifyM&&<Modal title={`Verify Result — ${verifyM.title}`} onClose={()=>setVerifyM(null)} width={680}>
        <div style={{fontSize:12,color:"#555",marginBottom:14}}>Submitted by <span style={{color:"#ffc107"}}>{verifyM.pending_result.submittedByName}</span>. Review payouts and screenshot then approve or reject.</div>
        <div style={{overflowX:"auto",marginBottom:14}}>
          <table className="rtbl" style={{minWidth:500}}>
            <thead><tr><th>RANK</th><th>PLAYER</th><th>APP UID</th><th>KILLS</th><th>RANK PRIZE</th><th>TOTAL PAYOUT</th></tr></thead>
            <tbody>
              {verifyM.pending_result.rows.map((r,i)=>(
                <tr key={i} className="vr">
                  <td><div className="orb" style={{color:"#ffc107",fontWeight:700}}>#{r.rank}</div></td>
                  <td><div style={{fontWeight:600}}>{r.userName||"—"}</div><div style={{fontSize:11,color:"#444"}}>{r.iguid}</div></td>
                  <td><div className="orb" style={{fontSize:11,color:"#00FFFF"}}>{r.appUid||"—"}</div></td>
                  <td><div style={{color:"#dc3545",fontWeight:700}}>{r.kills}</div></td>
                  <td><div className="neon-y orb" style={{fontSize:12}}>{fmt(r.rankPrize)}</div></td>
                  <td><div className="neon-g orb" style={{fontSize:14,fontWeight:900}}>{fmt(r.totalPrize)}</div></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div style={{fontSize:13,color:"#777",marginBottom:10}}>Total Payout: <span className="neon-g orb" style={{fontWeight:900}}>{fmt(verifyM.pending_result.rows.reduce((a,r)=>a+r.totalPrize,0))}</span></div>
        {verifyM.pending_result.proof&&<img src={verifyM.pending_result.proof} alt="proof" style={{width:"100%",borderRadius:10,border:"1px solid rgba(0,255,255,0.2)",marginBottom:16}}/>}
        <div className="g2">
          <button className="btn br" style={{padding:"12px 0"}} onClick={()=>{setRejectM(verifyM);setRejectReason("");}}>✗ Reject Result</button>
          <button className="btn bg" style={{padding:"12px 0"}} onClick={()=>approveResult(verifyM)}>✓ Approve & Credit Wallets</button>
        </div>
      </Modal>}

      {/* Reject Reason Modal */}
      {rejectM&&<Modal title="Reject Match Result" onClose={()=>setRejectM(null)} width={400}>
        <div style={{fontSize:13,color:"#666",marginBottom:14}}>This reason will be shown to the moderator who submitted the result.</div>
        <textarea rows={3} placeholder="Reason for rejection (required)..." value={rejectReason} onChange={e=>setRejectReason(e.target.value)} style={{marginBottom:14}}/>
        <div className="g2">
          <button className="btn bgh" style={{padding:"11px 0"}} onClick={()=>setRejectM(null)}>Cancel</button>
          <button className="btn br" style={{padding:"11px 0"}} onClick={()=>rejectResult(rejectM)}>Confirm Reject</button>
        </div>
      </Modal>}
      {toast&&<Toast msg={toast.msg} type={toast.type}/>}
    </div>
  );
};

const AdminPayments = () => {
  const [pmts,setPmts]=useState(PAYMENTS_DB.filter(p=>p.status==="pending"));
  const [rejectM,setRejectM]=useState(null);const [rejectReason,setRejectReason]=useState("");
  const [toast,setToast]=useState(null);
  const showToast=(msg,type="ok")=>{setToast({msg,type});setTimeout(()=>setToast(null),2800);};
  const refresh=()=>setPmts(PAYMENTS_DB.filter(p=>p.status==="pending"));
  const approve=p=>{
    const ui=USERS_DB.findIndex(u=>u.id===p.userId);if(ui>=0)USERS_DB[ui].deposit_bal+=p.amount;
    const pi=PAYMENTS_DB.findIndex(x=>x.id===p.id);if(pi>=0)PAYMENTS_DB[pi].status="approved";
    TXN_DB.unshift({id:Date.now(),userId:p.userId,type:"deposit",desc:`Deposit Approved · UTR ${p.utr}`,amount:p.amount,date:"Today",status:"completed"});
    refresh();showToast(`₹${p.amount} credited to ${p.user_name}'s wallet`);
  };
  const reject=()=>{
    if(!rejectReason.trim())return showToast("Enter rejection reason","err");
    const pi=PAYMENTS_DB.findIndex(x=>x.id===rejectM.id);if(pi>=0)PAYMENTS_DB[pi].status="rejected";
    refresh();setRejectM(null);showToast("Payment rejected. Reason logged.");
  };
  return(
    <div style={{padding:24}}>
      <div className="orb" style={{fontSize:18,fontWeight:700,color:"#ffc107",marginBottom:8}}>Pending Deposits</div>
      <div style={{fontSize:13,color:"#555",marginBottom:22}}>{pmts.length} requests awaiting review</div>
      {pmts.length===0&&<div style={{textAlign:"center",color:"#2a2a2a",padding:"40px 0"}}><CheckCircle size={40} style={{color:"#1e1e1e",display:"block",margin:"0 auto 10px"}}/>All payments processed!</div>}
      <div className="col">
        {pmts.map(p=>(
          <div key={p.id} className="acard anim">
            <div className="row" style={{justifyContent:"space-between",marginBottom:12}}>
              <div><div style={{fontWeight:700,fontSize:15}}>{p.user_name}</div><div style={{fontSize:11,color:"#444",marginTop:2}}>{p.uid} · +91 {p.mobile}</div></div>
              <div style={{textAlign:"right"}}><div className="orb neon-y" style={{fontSize:24,fontWeight:900}}>₹{p.amount}</div><div style={{fontSize:10,color:"#444"}}>{p.date}</div></div>
            </div>
            <div className="row" style={{background:"rgba(0,0,0,0.25)",borderRadius:8,padding:"9px 12px",marginBottom:12,justifyContent:"space-between"}}>
              <span style={{fontSize:12,color:"#666"}}>UTR: <span className="orb neon" style={{fontSize:13}}>{p.utr}</span></span>
              <button className="btn bc" style={{padding:"4px 10px",fontSize:11}}>View Screenshot</button>
            </div>
            <div className="g2">
              <button className="btn br" style={{padding:"10px 0",fontSize:13}} onClick={()=>{setRejectM(p);setRejectReason("");}}>❌ Reject</button>
              <button className="btn bg" style={{padding:"10px 0",fontSize:13}} onClick={()=>approve(p)}>✅ Approve & Credit</button>
            </div>
          </div>
        ))}
      </div>
      {rejectM&&<Modal title="Reject Deposit" onClose={()=>setRejectM(null)} width={400}>
        <div style={{fontSize:13,color:"#666",marginBottom:14}}>This reason will be logged for {rejectM?.user_name}.</div>
        <textarea rows={3} placeholder="Reason for rejection..." value={rejectReason} onChange={e=>setRejectReason(e.target.value)} style={{marginBottom:14}}/>
        <div className="g2">
          <button className="btn bgh" style={{padding:"11px 0"}} onClick={()=>setRejectM(null)}>Cancel</button>
          <button className="btn br" style={{padding:"11px 0"}} onClick={reject}>Confirm Reject</button>
        </div>
      </Modal>}
      {toast&&<Toast msg={toast.msg} type={toast.type}/>}
    </div>
  );
};

const AdminUsers = () => {
  const [query,setQuery]=useState("");const [selected,setSelected]=useState(null);
  const [walletM,setWalletM]=useState(null);const [walletAmt,setWalletAmt]=useState("");
  const [toast,setToast]=useState(null);const [tick,setTick]=useState(0);
  const showToast=(msg,type="ok")=>{setToast({msg,type});setTimeout(()=>setToast(null),2800);};
  const refresh=()=>{setTick(t=>t+1);if(selected)setSelected(USERS_DB.find(u=>u.id===selected.id)||null);};
  const allU=USERS_DB.filter(u=>u.role==="user");
  const filtered=allU.filter(u=>u.name.toLowerCase().includes(query.toLowerCase())||u.phone.includes(query)||u.uid.toLowerCase().includes(query.toLowerCase()));
  const changeRole=(userId,newRole)=>{
    const i=USERS_DB.findIndex(u=>u.id===userId);if(i<0)return;
    USERS_DB[i].role=newRole;authInvalidate(userId);refresh();
    showToast(`Role changed to ${newRole}. User session terminated.`);
  };
  const toggleBan=u=>{
    const i=USERS_DB.findIndex(x=>x.id===u.id);if(i<0)return;
    USERS_DB[i].banned=!USERS_DB[i].banned;
    if(USERS_DB[i].banned)authInvalidate(u.id);refresh();
    showToast(USERS_DB[i].banned?"User banned — session terminated.":"User unbanned successfully.");
  };
  const doWallet=()=>{
    const amt=+walletAmt;if(!amt||isNaN(amt))return showToast("Enter a valid amount","err");
    const i=USERS_DB.findIndex(u=>u.id===selected.id);if(i<0)return;
    USERS_DB[i][walletM.key]=Math.max(0,(USERS_DB[i][walletM.key]||0)+(walletM.dir==="add"?amt:-amt));
    TXN_DB.unshift({id:Date.now(),userId:selected.id,type:walletM.dir==="add"?"deposit":"entry",desc:`Admin ${walletM.label}`,amount:walletM.dir==="add"?amt:-amt,date:"Today",status:"completed"});
    refresh();setWalletM(null);setWalletAmt("");showToast(`${walletM.label}: ₹${amt} ${walletM.dir==="add"?"credited":"debited"}`);
  };
  const fresh=selected?USERS_DB.find(u=>u.id===selected.id)||selected:null;
  return(
    <div style={{padding:24}}>
      <div className="orb" style={{fontSize:18,fontWeight:700,color:"#ffc107",marginBottom:20}}>User Management</div>
      <div style={{position:"relative",marginBottom:20}}>
        <Search size={14} style={{position:"absolute",left:13,top:"50%",transform:"translateY(-50%)",color:"#444"}}/>
        <input placeholder="Search by name, mobile number, or App UID..." value={query} onChange={e=>setQuery(e.target.value)} style={{paddingLeft:"36px!important"}}/>
      </div>
      {!fresh?<div className="glass" style={{padding:0,overflow:"hidden"}}>
        {filtered.map((u,i)=>(
          <div key={u.id} className="row tr" onClick={()=>setSelected(u)}>
            <Av init={u.avatar} size={38} color="#00FFFF"/>
            <div style={{flex:1}}><div style={{fontWeight:700}}>{u.name}</div><div style={{fontSize:11,color:"#3e3e3e",marginTop:2}}>{u.uid} · {u.phone}</div></div>
            <div className="row" style={{gap:6}}>{u.banned&&<Bdg label="BANNED" cls="bdg br2"/>}<ChevronRight size={14} style={{color:"#2a2a2a"}}/></div>
          </div>
        ))}
        {filtered.length===0&&<div style={{padding:24,textAlign:"center",color:"#2a2a2a"}}>No users found</div>}
      </div>:
      <div className="anim">
        <button onClick={()=>setSelected(null)} style={{background:"none",border:"none",color:"#555",cursor:"pointer",marginBottom:16,fontFamily:"Rajdhani",fontSize:14,display:"flex",alignItems:"center",gap:6}}>← Back to Users</button>
        <div className="acard" style={{marginBottom:14}}>
          <div className="row" style={{gap:14,marginBottom:16}}>
            <Av init={fresh.avatar} size={52} color="#00FFFF"/>
            <div style={{flex:1}}>
              <div className="orb" style={{fontSize:16,fontWeight:700}}>{fresh.name}</div>
              <div className="neon orb" style={{fontSize:12}}>{fresh.uid}</div>
              <div className="row" style={{gap:6,marginTop:6}}>
                <Bdg label={fresh.banned?"BANNED":"ACTIVE"} cls={`bdg ${fresh.banned?"br2":"bg2"}`}/>
                <Bdg label="18+ VERIFIED" cls="bdg bc2"/>
              </div>
            </div>
          </div>
          <div className="g2" style={{marginBottom:14}}>
            {[["PHONE",fresh.phone],["EMAIL",fresh.email],["JOINED",fresh.joined||"—"],["REFERRAL CODE",fresh.referral||"—"]].map(([l,v])=>(
              <div key={l} style={{background:"rgba(0,0,0,0.25)",borderRadius:8,padding:"8px 10px"}}>
                <div style={{fontSize:9,color:"#3a3a3a",fontFamily:"Orbitron"}}>{l}</div>
                <div style={{fontSize:12,marginTop:2,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{v}</div>
              </div>
            ))}
          </div>
          {/* Role dropdown — triggers forced logout */}
          <div className="row" style={{background:"rgba(255,193,7,0.045)",border:"1px solid rgba(255,193,7,0.14)",borderRadius:10,padding:"10px 14px",marginBottom:14,gap:12}}>
            <div style={{flex:1}}>
              <div style={{fontSize:10,color:"#666",fontFamily:"Orbitron",marginBottom:2}}>USER ROLE</div>
              <div style={{fontSize:12,color:"#888"}}>Changing role will instantly force logout this user</div>
            </div>
            <select value={fresh.role} onChange={e=>changeRole(fresh.id,e.target.value)} style={{width:"auto!important",background:"rgba(0,0,0,0.3)!important"}}>
              {["user","moderator","admin"].map(r=><option key={r} value={r}>{r.charAt(0).toUpperCase()+r.slice(1)}</option>)}
            </select>
          </div>
        </div>
        <div className="g3" style={{marginBottom:14}}>
          {[["DEPOSIT","deposit_bal","#00FFFF"],["WINNING","winning_bal","#28a745"],["BONUS","bonus_bal","#A200FF"]].map(([l,k,c])=>(
            <div key={k} className="acard" style={{textAlign:"center"}}>
              <div style={{fontSize:9,color:"#3a3a3a",fontFamily:"Orbitron"}}>{l}</div>
              <div className="orb" style={{fontSize:18,fontWeight:900,color:c,margin:"4px 0"}}>{fmt(fresh[k]||0)}</div>
            </div>
          ))}
        </div>
        <div className="g3" style={{marginBottom:16}}>
          {[["Matches",fresh.matches_played||0],["Total Won",fmt(fresh.total_won||0)],["Deposited",fmt(fresh.total_deposited||0)]].map(([l,v])=>(
            <div key={l} className="acard" style={{textAlign:"center"}}><div style={{fontSize:15,fontWeight:800,color:"#555"}}>{v}</div><div style={{fontSize:10,color:"#3a3a3a",marginTop:2}}>{l}</div></div>
          ))}
        </div>
        <div style={{display:"flex",flexWrap:"wrap",gap:10}}>
          <button className="btn bt" style={{flex:"1 1 120px",padding:"11px 0",fontSize:13}} onClick={()=>setWalletM({key:"deposit_bal",label:"Deposit Credit",dir:"add"})}>💰 Deposit</button>
          <button className="btn bt" style={{flex:"1 1 120px",padding:"11px 0",fontSize:13}} onClick={()=>setWalletM({key:"winning_bal",label:"Withdrawal Debit",dir:"sub"})}>📤 Withdraw</button>
          <button className="btn by" style={{flex:"1 1 120px",padding:"11px 0",fontSize:13}} onClick={()=>setWalletM({key:"bonus_bal",label:"Bonus Credit",dir:"add"})}>🎁 Credit Bonus</button>
          <button className={`btn ${fresh.banned?"bg":"br"}`} style={{flex:"1 1 120px",padding:"11px 0",fontSize:13}} onClick={()=>toggleBan(fresh)}>{fresh.banned?"🔓 Unban User":"🚫 Ban User"}</button>
        </div>
      </div>}
      {walletM&&<Modal title={`${walletM.dir==="add"?"Credit":"Debit"} — ${walletM.label}`} onClose={()=>setWalletM(null)} width={360}>
        <div style={{fontSize:13,color:"#555",marginBottom:14}}>{walletM.dir==="add"?"Funds will be added to":"Funds will be deducted from"} {fresh?.name}'s {walletM.label.split(" ")[0]} wallet.</div>
        <input type="number" placeholder="Enter amount (₹)" value={walletAmt} onChange={e=>setWalletAmt(e.target.value)} style={{marginBottom:16}}/>
        <div className="g2">
          <button className="btn bgh" style={{padding:"11px 0"}} onClick={()=>setWalletM(null)}>Cancel</button>
          <button className={`btn ${walletM.dir==="add"?"by":"br"}`} style={{padding:"11px 0"}} onClick={doWallet}>Confirm →</button>
        </div>
      </Modal>}
      {toast&&<Toast msg={toast.msg} type={toast.type}/>}
    </div>
  );
};

const AdminDisputes = () => {
  const [disputes,setDisputes]=useState([...DISPUTES_DB]);const [selected,setSelected]=useState(null);const [reply,setReply]=useState("");
  const refresh=()=>setDisputes([...DISPUTES_DB]);
  const resolve=()=>{
    if(!reply.trim())return;const i=DISPUTES_DB.findIndex(d=>d.id===selected.id);
    if(i>=0){DISPUTES_DB[i].status="resolved";DISPUTES_DB[i].reply=reply;}
    refresh();setSelected({...selected,status:"resolved",reply});setReply("");
  };
  return(
    <div style={{padding:24}}>
      <div className="orb" style={{fontSize:18,fontWeight:700,color:"#ffc107",marginBottom:20}}>Support Tickets</div>
      <div className="g2" style={{marginBottom:20}}>
        {[["open","Open","#dc3545"],["resolved","Resolved","#28a745"]].map(([s,l,c])=>(
          <div key={s} className="acard" style={{textAlign:"center",borderColor:c+"22"}}>
            <div className="orb" style={{fontSize:22,fontWeight:900,color:c}}>{disputes.filter(d=>d.status===s).length}</div>
            <div style={{fontSize:11,color:"#555",marginTop:2}}>{l} Tickets</div>
          </div>
        ))}
      </div>
      {!selected?<div className="glass" style={{padding:0,overflow:"hidden"}}>
        {disputes.map((d,i)=>(
          <div key={d.id} className="tr" onClick={()=>{setSelected(d);setReply(d.reply||"");}}>
            <div className="row" style={{justifyContent:"space-between",marginBottom:4}}>
              <div className="orb" style={{fontSize:11,color:"#00FFFF"}}>{d.id}</div>
              <Bdg label={d.status.toUpperCase()} cls={`bdg ${d.status==="open"?"br2":"bg2"}`}/>
            </div>
            <div style={{fontWeight:700}}>{d.subject}</div>
            <div style={{fontSize:11,color:"#3e3e3e",marginTop:2}}>{d.user} · {d.uid} · {d.date}</div>
          </div>
        ))}
        {disputes.length===0&&<div style={{padding:24,textAlign:"center",color:"#2a2a2a"}}>No tickets</div>}
      </div>:
      <div className="anim">
        <button onClick={()=>setSelected(null)} style={{background:"none",border:"none",color:"#555",cursor:"pointer",marginBottom:16,fontFamily:"Rajdhani",fontSize:14,display:"flex",alignItems:"center",gap:6}}>← Back to Tickets</button>
        <div className="acard" style={{marginBottom:14}}>
          <div className="row" style={{justifyContent:"space-between",marginBottom:10}}>
            <div className="orb" style={{color:"#00FFFF",fontSize:11}}>{selected.id}</div>
            <Bdg label={selected.status.toUpperCase()} cls={`bdg ${selected.status==="open"?"br2":"bg2"}`}/>
          </div>
          <div style={{fontWeight:700,fontSize:16,marginBottom:4}}>{selected.subject}</div>
          <div style={{fontSize:11,color:"#555",marginBottom:12}}>{selected.user} · {selected.uid} · {selected.date}</div>
          <div style={{background:"rgba(0,0,0,0.3)",borderRadius:8,padding:12,fontSize:13,color:"#aaa",lineHeight:1.6}}>{selected.desc}</div>
        </div>
        {selected.reply&&<div className="glass-g" style={{padding:14,borderRadius:12,marginBottom:14}}>
          <div className="orb" style={{fontSize:9,color:"#28a745",marginBottom:6,letterSpacing:2}}>ADMIN REPLY</div>
          <div style={{fontSize:13}}>{selected.reply}</div>
        </div>}
        {selected.status==="open"&&<div className="acard">
          <div style={{fontSize:12,color:"#555",marginBottom:8}}>Reply and resolve this ticket</div>
          <textarea rows={3} placeholder="Type your reply to the user..." value={reply} onChange={e=>setReply(e.target.value)} style={{marginBottom:10}}/>
          <button className="btn bt" style={{width:"100%",padding:"11px 0"}} onClick={resolve}>Send Reply & Resolve →</button>
        </div>}
      </div>}
    </div>
  );
};

const AdminSettings = ({adminUser}) => {
  const [s,setS]=useState({...PLATFORM});const [saved,setSaved]=useState(false);
  const [pwM,setPwM]=useState(false);const [pw,setPw]=useState({old:"",nw:"",conf:""});
  const [pwErr,setPwErr]=useState("");const [pwOk,setPwOk]=useState(false);
  const [showOld,setShowOld]=useState(false);const [showNw,setShowNw]=useState(false);
  const [toast,setToast]=useState(null);
  const showToast=(msg,type="ok")=>{setToast({msg,type});setTimeout(()=>setToast(null),2800);};
  const saveSettings=()=>{Object.assign(PLATFORM,s);setSaved(true);setTimeout(()=>setSaved(false),2000);showToast("All platform settings saved!");};
  const changePw=()=>{
    const u=USERS_DB.find(u=>u.id===adminUser.id);if(!u)return;
    if(pw.old!==u.password)return setPwErr("Current password is incorrect.");
    if(pw.nw.length<6)return setPwErr("New password must be at least 6 characters.");
    if(pw.nw!==pw.conf)return setPwErr("Passwords do not match.");
    u.password=pw.nw;setPwErr("");setPwOk(true);
    setTimeout(()=>{setPwM(false);setPw({old:"",nw:"",conf:""});setPwOk(false);showToast("Password changed successfully!");},1200);
  };
  return(
    <div style={{padding:"24px 24px 100px"}}>
      <div className="orb" style={{fontSize:18,fontWeight:700,color:"#ffc107",marginBottom:24}}>Platform Settings</div>
      <div className="col" style={{gap:20}}>
        <div className="acard">
          <div className="row" style={{gap:8,marginBottom:16}}><CreditCard size={14} style={{color:"#20C997"}}/><div className="orb" style={{fontSize:10,color:"#20C997",letterSpacing:2}}>PAYMENT GATEWAY</div></div>
          <div className="col" style={{gap:10}}>
            <LI label="Global UPI ID" value={s.upi_id} onChange={e=>setS({...s,upi_id:e.target.value})} placeholder="yourapp@upi"/>
            <div><div style={{fontSize:11.5,color:"#555",fontFamily:"Rajdhani",marginBottom:6}}>Global QR Code</div>
              <div className="upz"><Upload size={15} style={{color:"#555",display:"block",margin:"0 auto 5px"}}/><div style={{color:"#555",fontSize:13}}>Upload QR Code Image</div></div>
            </div>
          </div>
        </div>
        <div className="acard">
          <div className="row" style={{gap:8,marginBottom:16}}><Gift size={14} style={{color:"#ffc107"}}/><div className="orb" style={{fontSize:10,color:"#ffc107",letterSpacing:2}}>REFERRAL & BONUS</div></div>
          <div className="g2" style={{gap:10}}>
            <LI label="Referrer Bonus (₹)" type="number" value={s.referrer_bonus} onChange={e=>setS({...s,referrer_bonus:+e.target.value})}/>
            <LI label="Referee Bonus (₹)" type="number" value={s.referee_bonus} onChange={e=>setS({...s,referee_bonus:+e.target.value})}/>
            <LI label="Max Bonus Usage per Match (%)" type="number" value={s.max_bonus_pct} onChange={e=>setS({...s,max_bonus_pct:+e.target.value})}/>
            <LI label="Room Reveal (mins before match)" type="number" value={s.room_reveal_mins} onChange={e=>setS({...s,room_reveal_mins:+e.target.value})}/>
          </div>
        </div>
        <div className="acard">
          <div className="row" style={{gap:8,marginBottom:16}}><Activity size={14} style={{color:"#dc3545"}}/><div className="orb" style={{fontSize:10,color:"#dc3545",letterSpacing:2}}>LIVE STREAM</div></div>
          <div className="col" style={{gap:10}}>
            <LI label="YouTube Live URL" value={s.live_url} onChange={e=>setS({...s,live_url:e.target.value})} placeholder="https://youtube.com/live/..."/>
            <label className="row" style={{cursor:"pointer",gap:8}}>
              <input type="checkbox" checked={s.show_live} onChange={e=>setS({...s,show_live:e.target.checked})}/>
              <span style={{fontSize:14,color:"#888"}}>Show Live Banner on User App</span>
            </label>
          </div>
        </div>
      </div>
      {/* Footer Action Buttons */}
      <div style={{position:"fixed",bottom:0,right:0,left:220,background:"rgba(18,20,24,0.97)",backdropFilter:"blur(12px)",borderTop:"1px solid rgba(255,255,255,0.05)",padding:"14px 24px",display:"flex",justifyContent:"space-between",gap:14,zIndex:50}}>
        <button className="btn bgh" style={{padding:"11px 24px",display:"flex",alignItems:"center",gap:8}} onClick={()=>{setPwM(true);setPwErr("");setPwOk(false);}}>
          <KeyRound size={14}/>Change Password
        </button>
        <button className={`btn ${saved?"bg":"by"}`} style={{padding:"11px 32px",fontSize:15}} onClick={saveSettings}>
          {saved?"✓ Settings Saved!":"Save Changes →"}
        </button>
      </div>
      {/* Change Password Modal */}
      {pwM&&<Modal title="Change Password" onClose={()=>setPwM(false)} width={400}>
        {pwOk?<div className="glass-g" style={{padding:20,textAlign:"center",borderRadius:12}}>
          <CheckCircle size={32} style={{color:"#28a745",display:"block",margin:"0 auto 10px"}}/><div className="neon-g" style={{fontWeight:700,fontSize:16}}>Password Updated!</div>
        </div>:<div className="col">
          <div><div style={{fontSize:11.5,color:"#555",fontFamily:"Rajdhani",marginBottom:4}}>Current Password</div>
            <div style={{position:"relative"}}>
              <input type={showOld?"text":"password"} placeholder="Enter current password" value={pw.old} onChange={e=>setPw({...pw,old:e.target.value})} style={{paddingRight:"38px!important"}}/>
              <div style={{position:"absolute",right:13,top:"50%",transform:"translateY(-50%)",cursor:"pointer"}} onClick={()=>setShowOld(!showOld)}>
                {showOld?<EyeOff size={14} style={{color:"#555"}}/>:<Eye size={14} style={{color:"#555"}}/>}
              </div>
            </div>
          </div>
          <div><div style={{fontSize:11.5,color:"#555",fontFamily:"Rajdhani",marginBottom:4}}>New Password</div>
            <div style={{position:"relative"}}>
              <input type={showNw?"text":"password"} placeholder="Minimum 6 characters" value={pw.nw} onChange={e=>setPw({...pw,nw:e.target.value})} style={{paddingRight:"38px!important"}}/>
              <div style={{position:"absolute",right:13,top:"50%",transform:"translateY(-50%)",cursor:"pointer"}} onClick={()=>setShowNw(!showNw)}>
                {showNw?<EyeOff size={14} style={{color:"#555"}}/>:<Eye size={14} style={{color:"#555"}}/>}
              </div>
            </div>
          </div>
          <LI label="Re-enter New Password" type="password" placeholder="Confirm new password" value={pw.conf} onChange={e=>setPw({...pw,conf:e.target.value})}/>
          {pwErr&&<div className="neon-r" style={{fontSize:12}}><AlertTriangle size={12} style={{marginRight:4}}/>{pwErr}</div>}
          <div className="g2">
            <button className="btn bgh" style={{padding:"11px 0"}} onClick={()=>setPwM(false)}>Cancel</button>
            <button className="btn bp" style={{padding:"11px 0"}} onClick={changePw}>Update Password →</button>
          </div>
        </div>}
      </Modal>}
      {toast&&<Toast msg={toast.msg} type={toast.type}/>}
    </div>
  );
};

// ══════════════════════════════════════════════════════════════════
//  ADMIN SHELL
// ══════════════════════════════════════════════════════════════════
const AdminApp = ({adminUser,onLogout}) => {
  const isAdmin=adminUser.role==="admin";
  const [tab,setTab]=useState(isAdmin?"analytics":"matches");
  const [open,setOpen]=useState(true);
  const NAVITEMS=[
    {id:"analytics",l:"Analytics",   I:BarChart2,    adminOnly:true},
    {id:"matches",  l:"Tournaments", I:Swords,       adminOnly:false},
    {id:"payments", l:"Payments",    I:CreditCard,   adminOnly:true},
    {id:"users",    l:"Users",       I:Users,        adminOnly:true},
    {id:"disputes", l:"Disputes",    I:MessageSquare,adminOnly:false},
    {id:"settings", l:"Settings",    I:Settings,     adminOnly:true},
  ].filter(n=>!n.adminOnly||isAdmin);
  const pendingPay=PAYMENTS_DB.filter(p=>p.status==="pending").length;
  const pendingRes=MATCHES_DB.filter(m=>m.pending_result?.status==="pending").length;
  useEffect(()=>{
    const iv=setInterval(()=>{const c=authCheck(adminUser.token);if(!c)onLogout();},2000);
    return()=>clearInterval(iv);
  },[adminUser.token]);
  return(
    <div style={{display:"flex",minHeight:"100vh",background:"#0d0f14"}}>
      {/* Sidebar */}
      <div style={{width:open?220:58,background:"#121418",borderRight:"1px solid rgba(255,193,7,0.07)",transition:"width .25s",overflow:"hidden",flexShrink:0,display:"flex",flexDirection:"column"}}>
        <div style={{padding:"18px 14px",borderBottom:"1px solid rgba(255,255,255,0.04)",minHeight:62}}>
          {open?<div className="row" style={{justifyContent:"space-between"}}>
            <div><div className="orb" style={{color:"#ffc107",fontSize:17,fontWeight:900}}>RIOX</div><div style={{fontSize:9,color:"#3a3a3a",fontFamily:"Orbitron",letterSpacing:2}}>STAFF PANEL</div></div>
            <Menu size={15} style={{color:"#444",cursor:"pointer"}} onClick={()=>setOpen(false)}/>
          </div>:<Menu size={17} style={{color:"#444",cursor:"pointer",marginTop:4}} onClick={()=>setOpen(true)}/>}
        </div>
        <div style={{flex:1,padding:"10px 8px"}}>
          {NAVITEMS.map(n=>(
            <div key={n.id} className={`si ${tab===n.id?"on":""}`} onClick={()=>setTab(n.id)} title={!open?n.l:""}>
              <div style={{position:"relative",flexShrink:0}}>
                <n.I size={17}/>
                {n.id==="payments"&&pendingPay>0&&<div style={{position:"absolute",top:-4,right:-4,background:"#dc3545",borderRadius:"50%",width:8,height:8}}/>}
                {n.id==="matches"&&pendingRes>0&&<div style={{position:"absolute",top:-4,right:-4,background:"#ffc107",borderRadius:"50%",width:8,height:8}}/>}
              </div>
              {open&&<span>{n.l}</span>}
            </div>
          ))}
        </div>
        <div style={{padding:"10px 8px",borderTop:"1px solid rgba(255,255,255,0.04)"}}>
          <div className="si" onClick={onLogout} title={!open?"Logout":""}><LogOut size={17}/>{open&&<span>Logout</span>}</div>
          {open&&<div className="row" style={{padding:"8px 6px",gap:8}}>
            <Av init={adminUser.avatar} size={30} color={isAdmin?"#ffc107":"#20C997"}/>
            <div style={{overflow:"hidden",flex:1}}>
              <div style={{fontSize:12,fontWeight:700,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{adminUser.name}</div>
              <div style={{fontSize:10,color:isAdmin?"#ffc107":"#20C997"}}>{adminUser.role.toUpperCase()}</div>
            </div>
          </div>}
        </div>
      </div>
      {/* Main content */}
      <div style={{flex:1,overflowY:"auto",minWidth:0}}>
        <div style={{padding:"14px 24px",background:"rgba(18,20,24,0.92)",backdropFilter:"blur(14px)",borderBottom:"1px solid rgba(255,255,255,0.04)",position:"sticky",top:0,zIndex:50,display:"flex",justifyContent:"space-between",alignItems:"center"}}>
          <div>
            <div className="orb" style={{fontSize:16,fontWeight:700}}>{NAVITEMS.find(n=>n.id===tab)?.l}</div>
            <div style={{fontSize:11,color:"#3a3a3a",marginTop:2}}>{new Date().toLocaleDateString("en-IN",{weekday:"long",year:"numeric",month:"long",day:"numeric"})}</div>
          </div>
          <div className="row" style={{gap:12}}>
            <Bdg label={isAdmin?"ADMIN":"MODERATOR"} cls={`bdg ${isAdmin?"bgold":"bc2"}`}/>
            <div style={{position:"relative",cursor:"pointer"}}><Bell size={17} style={{color:"#555"}}/>{(pendingPay+pendingRes)>0&&<div className="ndot"/>}</div>
          </div>
        </div>
        {tab==="analytics"&&<AdminAnalytics/>}
        {tab==="matches"  &&<AdminMatches adminUser={adminUser}/>}
        {tab==="payments" &&<AdminPayments/>}
        {tab==="users"    &&<AdminUsers/>}
        {tab==="disputes" &&<AdminDisputes/>}
        {tab==="settings" &&<AdminSettings adminUser={adminUser}/>}
      </div>
    </div>
  );
};

// ══════════════════════════════════════════════════════════════════
//  ROOT
// ══════════════════════════════════════════════════════════════════
export default function App() {
  const [session,setSession]=useState(null);
  const onLogin=useCallback((user,token)=>setSession({user:{...user,token},token}),[]);
  const onLogout=useCallback(()=>{if(session?.token&&SESSION_STORE[session.token])SESSION_STORE[session.token].valid=false;setSession(null);},[session]);
  const setUser=useCallback(u=>setSession(s=>s?{...s,user:u}:s),[]);
  const {user}=session||{};
  const isStaff=user?.role==="admin"||user?.role==="moderator";
  return(
    <>
      <GS/>
      <div className="scan"/>
      {!user&&<AuthScreen onLogin={onLogin}/>}
      {user&&isStaff&&<AdminApp adminUser={user} onLogout={onLogout}/>}
      {user&&!isStaff&&<UserApp user={user} setUser={setUser} onLogout={onLogout}/>}
    </>
  );
}
