(() => {
  "use strict";

  const WIDTH = 1600;
  const HEIGHT = 900;
  const PLAY_BOUNDS = { left: 235, right: 1380, top: 295, bottom: 790 };
  const GATE = { x: 205, y: 665 };
  const MAX_GATE_HP = 200;
  const TOTAL_LEVELS = 8;

  const weapons = [
    {
      id: 0,
      name: "拳頭",
      price: 0,
      damage: 7,
      cooldown: 0.50,
      melee: true,
      range: 170,
      hitHeight: 105,
      icon: null,
      desc: "近戰扇形群攻"
    },
    {
      id: 1,
      name: "鐮刀",
      price: 50,
      damage: 8,
      cooldown: 0.45,
      melee: true,
      range: 220,
      hitHeight: 120,
      icon: "assets/weapons/01-scythe.png",
      desc: "大範圍近戰橫掃"
    },
    {
      id: 2,
      name: "長刀",
      price: 100,
      damage: 9,
      cooldown: 0.38,
      melee: true,
      range: 255,
      hitHeight: 125,
      icon: "assets/weapons/02-longsword.png",
      desc: "高速長距斬擊"
    },
    {
      id: 3,
      name: "弓",
      price: 250,
      damage: 8,
      cooldown: 0.40,
      melee: false,
      range: 420,
      laneWidth: 58,
      icon: "assets/weapons/03-bow.png",
      desc: "中距離直線穿透射擊"
    },
    {
      id: 4,
      name: "M1911",
      price: 550,
      damage: 10,
      cooldown: 0.30,
      melee: false,
      range: 380,
      laneWidth: 62,
      icon: "assets/weapons/04-m1911.png",
      desc: "中近距離半自動快速穿透"
    },
    {
      id: 5,
      name: "GL06",
      price: 900,
      damage: 20,
      cooldown: 1.00,
      melee: false,
      explosive: true,
      range: 460,
      blastRadius: 190,
      laneWidth: 68,
      icon: "assets/weapons/05-gl06.png",
      desc: "中距離榴彈範圍爆破＋減速"
    },
    {
      id: 6,
      name: "AK-47",
      price: 1500,
      damage: 15,
      cooldown: 0.22,
      melee: false,
      range: 520,
      laneWidth: 65,
      icon: "assets/weapons/06-ak47.png",
      desc: "中遠距離全自動連射穿透"
    },
    {
      id: 7,
      name: "M134",
      price: 2000,
      damage: 25,
      cooldown: 0.14,
      melee: false,
      range: 480,
      laneWidth: 78,
      icon: "assets/weapons/07-m134.png",
      desc: "中距離終極火神彈幕穿透"
    },
    {
      id: 8,
      name: "AWM",
      price: 2800,
      damage: 75,
      cooldown: 0.36,
      melee: false,
      range: 700,
      laneWidth: 82,
      knockback: 26,
      flipInHand: true,
      icon: "assets/weapons/08-awm.png",
      desc: "遠距離重型狙擊高傷貫穿＋擊退"
    },
    {
      id: 9,
      name: "飛刀",
      price: 3500,
      damage: 60,
      cooldown: 0.22,
      melee: false,
      range: 400,
      laneWidth: 86,
      icon: "assets/weapons/09-throwing-knife.png",
      desc: "中近距離疾風連擲高速穿透"
    },
    {
      id: 10,
      name: "愛國者",
      price: 5000,
      damage: 160,
      cooldown: 0.52,
      melee: false,
      explosive: true,
      mountedVehicle: true,
      range: 620,
      blastRadius: 270,
      laneWidth: 96,
      flipInHand: true,
      icon: "assets/weapons/10-patriot.png",
      desc: "搭乘大型防空飛彈機台・大範圍轟炸＋減速"
    },
    {
      id: 11,
      name: "RPG",
      price: 4200,
      damage: 115,
      cooldown: 0.48,
      melee: false,
      explosive: true,
      range: 560,
      blastRadius: 230,
      laneWidth: 88,
      flipInHand: true,
      icon: "assets/weapons/11-rpg.png",
      desc: "中遠程火箭筒大範圍高爆＋震退"
    }
  ];

  const monsterTypes = {
    zombie: {
      name: "方塊殭屍",
      hp: 20,
      attack: 10,
      reward: 10,
      travelTime: 13.5,
      image: "assets/monsters/zombie_monster.png",
      width: 148,
      height: 112
    },
    knight: {
      name: "冠帽小戰士",
      hp: 60,
      attack: 20,
      reward: 50,
      travelTime: 12.5,
      image: "assets/monsters/knight_monster.png",
      width: 162,
      height: 124
    },
    cavalry: {
      name: "裝甲騎兵",
      hp: 100,
      attack: 25,
      reward: 80,
      travelTime: 10.0,
      image: "assets/monsters/armored_cavalry_monster.png",
      width: 178,
      height: 138
    },
    ninja: {
      name: "忍者",
      hp: 150,
      attack: 35,
      reward: 120,
      travelTime: 9.0,
      agile: true,
      image: "assets/monsters/ninja_monster.png",
      width: 156,
      height: 122
    },
    mage: {
      name: "魔法師",
      hp: 195,
      attack: 40,
      spells: [
        { name: "隕石火球", dmg: 30, color: "#ff6b35" },
        { name: "魔法球", dmg: 40, color: "#a855f7" },
        { name: "閃電", dmg: 45, color: "#38bdf8" }
      ],
      reward: 160,
      travelTime: 15.0,
      image: "assets/monsters/mage_monster.png",
      width: 166,
      height: 132
    },
    demon: {
      name: "惡魔靈",
      hp: 250,
      attack: 50,
      reward: 200,
      travelTime: 11.5,
      float: true,
      image: "assets/monsters/demon_spirit_monster.png",
      width: 174,
      height: 136
    },
    reaper: {
      name: "死神",
      hp: 300,
      attack: 75,
      reward: 250,
      travelTime: 12.5,
      image: "assets/monsters/grim_reaper_monster.png",
      width: 184,
      height: 144
    },
    pistol: {
      name: "手槍兵",
      hp: 500,
      attack: 125,
      reward: 400,
      travelTime: 15.5,
      image: "assets/monsters/pistol_soldier_monster.png",
      width: 178,
      height: 140
    },
    gemini: {
      name: "AI-Gemini",
      hp: 750,
      attack: 150,
      reward: 600,
      travelTime: 18.0,
      boss: true,
      image: "assets/monsters/ai_gemini_monster.png",
      width: 198,
      height: 158
    },
    blade: {
      name: "刀之首領",
      hp: 1000,
      attack: 175,
      reward: 800,
      travelTime: 21.0,
      boss: true,
      image: "assets/monsters/blade_boss_monster.png",
      width: 222,
      height: 176
    }
  };

  const levels = {
    1: {
      title: "初陣・草地上的方塊屍潮",
      spawnInterval: 2.4,
      counts: { zombie: 18 }
    },
    2: {
      title: "皇冠小隊長的進擊",
      spawnInterval: 2.1,
      counts: { zombie: 18, knight: 4 }
    },
    3: {
      title: "鐵蹄奔襲・裝甲騎兵突擊",
      spawnInterval: 1.9,
      counts: { zombie: 14, knight: 5, cavalry: 5 }
    },
    4: {
      title: "疾風暗影・忍者的奇襲",
      spawnInterval: 1.8,
      counts: { zombie: 10, knight: 5, cavalry: 5, ninja: 5 }
    },
    5: {
      title: "秘法與魔眼・雙重威脅",
      spawnInterval: 1.75,
      counts: { knight: 8, cavalry: 6, ninja: 5, mage: 4, demon: 3 }
    },
    6: {
      title: "冥界收割・死神降臨",
      spawnInterval: 1.7,
      counts: { cavalry: 6, ninja: 6, mage: 4, demon: 5, reaper: 5 }
    },
    7: {
      title: "鋼鐵與硝煙・AI-Gemini 覺醒",
      spawnInterval: 1.65,
      counts: { ninja: 6, mage: 4, demon: 4, reaper: 4, pistol: 5, gemini: 2 }
    },
    8: {
      title: "王座的終極試煉・刀之首領降臨",
      spawnInterval: 1.6,
      counts: { cavalry: 5, ninja: 5, demon: 4, reaper: 5, pistol: 5, gemini: 2, blade: 2 }
    }
  };

  const canvas = document.querySelector("#game-canvas");
  const ctx = canvas.getContext("2d");
  const ui = Object.fromEntries([
    "hud", "gate-hp-count", "gate-hp-bar", "kill-count", "gold-count", "coin-pill", "hud-shop-button",
    "stage-label", "stage-subtitle",
    "weapon-chip", "weapon-thumb", "weapon-label", "weapon-switch-hint",
    "start-screen", "weapon-screen", "stage-preview", "owned-weapons",
    "owned-pager", "owned-prev-page", "owned-next-page", "owned-page-indicator",
    "start-level-button", "select-shop-button",
    "selection-kicker", "selection-copy", "shop-screen", "shop-kicker", "shop-subtitle", "shop-feedback",
    "shop-tabs", "shop-list", "shop-prev-page", "shop-next-page", "shop-page-indicator",
    "shop-gold", "finish-shop-button", "result-screen", "result-badge", "result-kicker", "result-title",
    "result-copy", "result-stats", "result-button", "result-shop-button",
    "pause-screen", "pause-button", "pause-shop-button", "resume-button",
    "restart-button", "enter-select-button", "joystick", "joystick-knob", "attack-button",
    "dev-hud-button", "dev-panel", "dev-status-tag", "dev-sandbox-toggle", "dev-clear-monsters",
    "dev-add-gold", "dev-minimize-btn", "dev-exit-btn", "dev-weapon-grid", "dev-monster-grid"
  ].map(id => [id, document.getElementById(id)]));

  const images = {};
  const assetPaths = {
    background: "assets/scenes/battlefield_background.jpeg",
    player: "assets/character/main.png"
  };
  Object.entries(monsterTypes).forEach(([key, m]) => { assetPaths[key] = m.image; });
  weapons.filter(w => w.icon).forEach(w => { assetPaths[`weapon-${w.id}`] = w.icon; });

  let state = "intro";
  let shopOrigin = "win";
  let level = 1;
  let gold = 0;
  let gateHp = MAX_GATE_HP;
  let checkpoint = null;
  let owned = new Set([0]);
  let weaponTiers = { 0: 1 };
  let selectedWeaponId = 0;
  let lastUpgradedWeaponId = null;
  let shopPage = 0;
  let ownedPage = 0;
  const SHOP_PAGE_SIZE = 4;
  const OWNED_PAGE_SIZE = 4;
  let devMode = false;
  let devSandbox = true;
  let devAllTier = 3;
  let devSpawnCount = 1;
  let devTapCount = 0;
  let devLastTapTime = 0;
  let monsters = [];
  let spawnQueue = [];
  let spawnClock = 0;
  let defeated = 0;
  let resolvedCount = 0;
  let levelEarned = 0;
  let lastBonus = 0;
  let lastTime = performance.now();
  let attackHeld = false;
  let attackClock = 0;
  let attackFlash = 0;
  let hitBursts = [];
  let explosions = [];
  let projectiles = [];
  let enemySpells = [];
  let floatingTexts = [];
  let shake = 0;
  let elapsed = 0;
  const keys = new Set();
  const player = { x: 425, y: 615, width: 96, height: 112, speed: 325, moving: false, moveDirX: 0 };
  const joystick = { pointerId: null, x: 0, y: 0 };

  const weaponHoldConfigs = {
    1:  { w: 72, h: 72, gripX: 16, gripY: 54, angle: 0.12 },                          // 鐮刀
    2:  { w: 52, h: 78, gripX: 25, gripY: 64, angle: 0.52 },                          // 長刀
    3:  { w: 58, h: 66, gripX: 40, gripY: 34, angle: 0.02,  muzzleX: 10, muzzleY: 0 },   // 弓
    4:  { w: 62, h: 46, gripX: 17, gripY: 28, angle: -0.04, muzzleX: 34, muzzleY: -17 }, // M1911
    5:  { w: 84, h: 46, gripX: 27, gripY: 28, angle: -0.04, muzzleX: 49, muzzleY: -12 }, // GL06
    6:  { w: 88, h: 48, gripX: 33, gripY: 28, angle: -0.04, muzzleX: 52, muzzleY: -7 },  // AK-47
    7:  { w: 86, h: 56, gripX: 32, gripY: 36, angle: -0.03, muzzleX: 38, muzzleY: -11 }, // M134
    8:  { w: 96, h: 44, gripX: 26, gripY: 28, angle: -0.04, muzzleX: 68, muzzleY: -10 }, // AWM (flipped)
    9:  { w: 68, h: 28, gripX: 26, gripY: 14, angle: -0.05, muzzleX: 24, muzzleY: 0 },   // 飛刀
    10: { w: 78, h: 60, gripX: 28, gripY: 42, angle: -0.02, muzzleX: 126, muzzleY: -22 },// 愛國者 (mounted vehicle)
    11: { w: 94, h: 42, gripX: 34, gripY: 26, angle: -0.04, muzzleX: 58, muzzleY: -11 }  // RPG (flipped)
  };

  function getWeaponMuzzleWorldPos(weaponId = selectedWeaponId) {
    if (weaponId === 10) {
      return { x: player.x + 126, y: player.y - 22 };
    }
    const cfg = weaponHoldConfigs[weaponId] || { muzzleX: 36, muzzleY: -10, angle: -0.04 };
    const handX = player.width * 0.21;
    const handY = -player.height * 0.47;
    const mx = cfg.muzzleX ?? 36;
    const my = cfg.muzzleY ?? -10;
    const rot = cfg.angle || 0;
    const cos = Math.cos(rot);
    const sin = Math.sin(rot);
    return {
      x: player.x + handX + (mx * cos - my * sin),
      y: player.y + handY + (mx * sin + my * cos)
    };
  }

  function loadImages() {
    return Promise.all(Object.entries(assetPaths).map(([key, path]) => new Promise(resolve => {
      const img = new Image();
      img.onload = () => { images[key] = img; resolve(); };
      img.onerror = resolve;
      img.src = path;
    })));
  }

  function shuffle(list) {
    for (let i = list.length - 1; i > 0; i -= 1) {
      const j = Math.floor(Math.random() * (i + 1));
      [list[i], list[j]] = [list[j], list[i]];
    }
    return list;
  }

  function getWeaponTier(weaponId) {
    return weaponTiers[weaponId] || 1;
  }

  function formatStars(tier) {
    return "★".repeat(tier) + "☆".repeat(Math.max(0, 3 - tier));
  }

  function getWeaponStatsForTier(weaponId, tier = getWeaponTier(weaponId)) {
    const base = weapons[weaponId];
    const dmgMult = tier === 1 ? 1 : tier === 2 ? 1.25 : 1.55;
    const cdMult = tier === 1 ? 1 : tier === 2 ? 0.90 : 0.80;
    const areaMult = tier === 1 ? 1 : tier === 2 ? 1.12 : 1.25;
    const rangeMult = base.melee ? areaMult : (tier === 1 ? 1 : tier === 2 ? 1.08 : 1.15);

    const damage = tier === 1
      ? base.damage
      : Math.max(base.damage + (tier === 2 ? 2 : 5), Math.round(base.damage * dmgMult));
    const cooldown = Number((base.cooldown * cdMult).toFixed(2));
    const attackSpeed = (1 / cooldown).toFixed(1);
    const range = base.range ? Math.round(base.range * rangeMult) : 400;
    const hitHeight = base.hitHeight ? Math.round(base.hitHeight * areaMult) : 0;
    const blastRadius = base.blastRadius ? Math.round(base.blastRadius * areaMult) : 0;
    const laneWidth = base.laneWidth ? Math.round(base.laneWidth * areaMult) : 0;
    const dps = (damage / cooldown).toFixed(1);

    let scopeLabel = "穿透寬度";
    let scopeValue = laneWidth;
    if (base.melee) {
      scopeLabel = "斬擊距離";
      scopeValue = range;
    } else if (base.explosive) {
      scopeLabel = "爆破半徑";
      scopeValue = blastRadius;
    }

    return {
      tier,
      damage,
      cooldown,
      attackSpeed,
      range,
      hitHeight,
      blastRadius,
      laneWidth,
      dps,
      scopeLabel,
      scopeValue
    };
  }

  function getWeaponDamage(weaponId) {
    return getWeaponStatsForTier(weaponId).damage;
  }

  function getUpgradePrice(weaponId) {
    const weapon = weapons[weaponId];
    const tier = getWeaponTier(weaponId);
    if (tier >= 3) return null;
    const baseCost = weapon.price || 150;
    return tier === 1 ? Math.round(baseCost * 0.8) : Math.round(baseCost * 1.5);
  }

  function getLevelTotalMonsters(lvl = level) {
    return Object.values(levels[lvl].counts).reduce((sum, n) => sum + n, 0);
  }

  function setScreen(id) {
    ["start-screen", "weapon-screen", "shop-screen", "result-screen", "pause-screen"].forEach(screen => {
      ui[screen].classList.toggle("is-hidden", screen !== id);
    });
  }

  function resetTouchControls() {
    joystick.pointerId = null;
    joystick.touchId = null;
    joystick.x = 0;
    joystick.y = 0;
    if (ui["joystick-knob"]) {
      ui["joystick-knob"].style.transform = "translate(0,0)";
    }
    attackHeld = false;
    if (ui["attack-button"]) {
      ui["attack-button"].classList.remove("is-pressed");
    }
  }

  function showControls(show) {
    if (!show) resetTouchControls();
    ui.hud.classList.toggle("is-hidden", !show);
    ui.joystick.classList.toggle("is-hidden", !show);
    ui["attack-button"].classList.toggle("is-hidden", !show);
    if (ui["dev-hud-button"]) {
      ui["dev-hud-button"].classList.toggle("is-hidden", !(show && devMode));
    }
    if (ui["dev-panel"]) {
      ui["dev-panel"].classList.toggle("is-hidden", !(show && devMode));
    }
  }

  function updateHUD() {
    const total = getLevelTotalMonsters(level);
    ui["kill-count"].textContent = `${resolvedCount} / ${total}`;
    ui["gold-count"].textContent = gold;
    ui["stage-label"].textContent = `第 ${level} / ${TOTAL_LEVELS} 關`;
    ui["stage-subtitle"].textContent = levels[level].title;

    ui["gate-hp-count"].textContent = `${gateHp} / ${MAX_GATE_HP}`;
    const hpRatio = Math.max(0, Math.min(1, gateHp / MAX_GATE_HP));
    ui["gate-hp-bar"].style.width = `${hpRatio * 100}%`;
    ui["gate-hp-bar"].style.background = hpRatio <= 0.3 ? "#e53e3e" : hpRatio <= 0.6 ? "#dd6b20" : "#38a169";

    const weapon = weapons[selectedWeaponId];
    const stats = getWeaponStatsForTier(selectedWeaponId);
    ui["weapon-label"].textContent = `${weapon.name} ★${stats.tier} (⚔️${stats.damage} · ⚡${stats.attackSpeed}/秒)`;
    ui["weapon-switch-hint"].textContent = owned.size > 1 ? "目前武器（點此或按 Q 切換）" : "目前武器";
    ui["weapon-thumb"].innerHTML = weapon.icon ? `<img src="${weapon.icon}" alt="" />` : "<span>✊</span>";
  }

  function cycleWeapon() {
    if (owned.size <= 1) return;
    const list = weapons.filter(w => owned.has(w.id)).map(w => w.id);
    const idx = list.indexOf(selectedWeaponId);
    selectedWeaponId = list[(idx + 1) % list.length];
    updateHUD();
    if (devMode) renderDevPanel();
    floatingTexts.push({
      x: player.x,
      y: player.y - 125,
      text: `切換：${weapons[selectedWeaponId].name}`,
      color: "#fff8b8",
      life: 0.75,
      maxLife: 0.75
    });
  }

  function weaponMarkup(weapon) {
    const stats = getWeaponStatsForTier(weapon.id);
    const art = weapon.icon ? `<img src="${weapon.icon}" alt="${weapon.name}" />` : '<div class="fist-art">✊</div>';
    return `<button class="weapon-option${selectedWeaponId === weapon.id ? " selected" : ""}" type="button" data-weapon="${weapon.id}">
      ${art}
      <strong>${weapon.name} ★${stats.tier}</strong>
      <small>⚔️ ${stats.damage} · ⚡ ${stats.attackSpeed}/秒 · 🎯 射程 ${stats.range}<br>${weapon.desc}</small>
    </button>`;
  }

  function renderStagePreview() {
    const counts = levels[level].counts;
    const badges = Object.entries(counts).map(([key, count]) => {
      const m = monsterTypes[key];
      return `<span class="preview-monster">
        <img src="${m.image}" alt="${m.name}" />
        <span>${m.name} ×${count} <small>(HP ${m.hp} / ⚔️${m.attack})</small></span>
      </span>`;
    }).join("");
    ui["stage-preview"].innerHTML = `<div style="width:100%;font-size:11px;font-weight:900;color:#4a5750;margin-bottom:2px;">第 ${level} 關敵軍情報（${levels[level].title}）</div>${badges}`;
  }

  function openWeaponSelection() {
    state = "selecting";
    showControls(false);
    setScreen("weapon-screen");
    ui["selection-kicker"].textContent = `第 ${level} / ${TOTAL_LEVELS} 關 · 戰前準備`;
    ui["selection-copy"].textContent = level === 1 && owned.size === 1
      ? "第一關從初始武器「拳頭」開始迎戰。消滅殭屍賺取金幣，隨時可進入補給小舖！"
      : "選擇開戰時手持的主武器；戰鬥途中隨時可按 Q 切換武器，或按 B 開啟補給小舖！";
    ui["start-level-button"].innerHTML = `開始第 ${level} 關 <span>→</span>`;
    const available = weapons.filter(w => owned.has(w.id));
    if (!available.some(w => w.id === selectedWeaponId)) selectedWeaponId = available.at(-1).id;
    const selIdx = Math.max(0, available.findIndex(w => w.id === selectedWeaponId));
    ownedPage = Math.floor(selIdx / OWNED_PAGE_SIZE);
    renderStagePreview();
    renderOwnedWeapons();
  }

  function renderOwnedWeapons() {
    const available = weapons.filter(w => owned.has(w.id));
    if (!available.some(w => w.id === selectedWeaponId)) selectedWeaponId = available.at(-1).id;
    const totalPages = Math.max(1, Math.ceil(available.length / OWNED_PAGE_SIZE));
    ownedPage = Math.max(0, Math.min(totalPages - 1, ownedPage));
    const pageItems = available.slice(ownedPage * OWNED_PAGE_SIZE, (ownedPage + 1) * OWNED_PAGE_SIZE);

    ui["owned-weapons"].innerHTML = pageItems.map(w => weaponMarkup(w)).join("");
    ui["owned-weapons"].querySelectorAll("[data-weapon]").forEach(button => {
      button.addEventListener("click", () => {
        selectedWeaponId = Number(button.dataset.weapon);
        renderOwnedWeapons();
      });
    });

    if (ui["owned-pager"]) {
      ui["owned-pager"].classList.toggle("is-hidden", totalPages <= 1);
      ui["owned-page-indicator"].textContent = `第 ${ownedPage + 1} / ${totalPages} 頁`;
    }
    if (ui["owned-prev-page"]) {
      ui["owned-prev-page"].disabled = ownedPage <= 0;
      ui["owned-prev-page"].classList.toggle("is-invisible", ownedPage <= 0);
    }
    if (ui["owned-next-page"]) {
      ui["owned-next-page"].disabled = ownedPage >= totalPages - 1;
      ui["owned-next-page"].classList.toggle("is-invisible", ownedPage >= totalPages - 1);
    }
  }

  function createSpawnQueue() {
    const counts = levels[level].counts;
    const regulars = [];
    const bosses = [];

    Object.entries(counts).forEach(([key, count]) => {
      const targetList = monsterTypes[key].boss ? bosses : regulars;
      for (let i = 0; i < count; i += 1) targetList.push(key);
    });

    shuffle(regulars);

    if (bosses.length === 2) {
      const midIndex = Math.floor(regulars.length * 0.55);
      regulars.splice(midIndex, 0, bosses[0]);
      regulars.push(bosses[1]);
    } else if (bosses.length >= 4) {
      const midIndex = Math.floor(regulars.length * 0.5);
      regulars.splice(midIndex, 0, bosses[0], bosses[1]);
      regulars.push(...bosses.slice(2));
    } else if (bosses.length > 0) {
      regulars.push(...bosses);
    }

    return regulars;
  }

  function startLevel() {
    state = "playing";
    monsters = [];
    spawnQueue = createSpawnQueue();
    spawnClock = 0.45;
    defeated = 0;
    resolvedCount = 0;
    levelEarned = 0;
    lastBonus = 0;
    gateHp = MAX_GATE_HP;
    attackClock = 0;
    attackHeld = false;
    hitBursts = [];
    explosions = [];
    projectiles = [];
    enemySpells = [];
    floatingTexts = [];
    player.x = 425;
    player.y = 615;
    checkpoint = {
      gold,
      owned: new Set(owned),
      weaponTiers: { ...weaponTiers },
      selectedWeaponId
    };
    setScreen(null);
    showControls(true);
    updateHUD();
  }

  function spawnMonster(typeKey) {
    const type = monsterTypes[typeKey];
    const y = 335 + Math.random() * 410;
    const x = 1510 + Math.random() * 45;
    const dx = GATE.x - x;
    const dy = GATE.y - y;
    const distance = Math.hypot(dx, dy);
    const speed = distance / type.travelTime;
    monsters.push({
      id: crypto.randomUUID ? crypto.randomUUID() : `${Date.now()}-${Math.random()}`,
      typeKey,
      x,
      y,
      baseY: y,
      vx: (dx / distance) * speed,
      vy: (dy / distance) * speed,
      hp: type.hp,
      maxHp: type.hp,
      attack: type.attack,
      reward: type.reward,
      hurt: 0,
      slowTimer: 0,
      casted: false,
      spawnTime: elapsed,
      dead: false
    });
  }

  function attack() {
    const weapon = weapons[selectedWeaponId];
    const stats = getWeaponStatsForTier(selectedWeaponId);
    const dmg = stats.damage;
    attackFlash = 0.15;
    attackClock = stats.cooldown;
    const hits = [];

    if (weapon.melee) {
      monsters.forEach(monster => {
        const dx = monster.x - player.x;
        const dy = Math.abs(monster.y - player.y);
        if (!monster.dead && dx >= -10 && dx <= stats.range && dy <= stats.hitHeight) {
          hits.push(monster);
        }
      });
      hits.forEach(monster => damageMonster(monster, dmg));
    } else if (weapon.explosive) {
      const muzzle = getWeaponMuzzleWorldPos(weapon.id);
      const maxReachX = Math.min(WIDTH - 190, player.x + stats.range);
      const candidates = monsters
        .filter(m => !m.dead && m.x > player.x + 15 && m.x <= maxReachX && Math.abs(m.y - player.y) <= stats.laneWidth)
        .sort((a, b) => a.x - b.x);

      const impactX = candidates.length ? candidates[0].x : maxReachX;
      const impactY = candidates.length ? candidates[0].y : player.y - 10;

      projectiles.push({
        startX: muzzle.x,
        x: muzzle.x,
        endX: impactX,
        y: muzzle.y,
        life: 0.18,
        maxLife: 0.18,
        weaponId: weapon.id
      });

      explosions.push({
        x: impactX,
        y: impactY - 25,
        radius: stats.blastRadius,
        life: 0.34,
        maxLife: 0.34
      });

      monsters.forEach(monster => {
        if (monster.dead) return;
        const dist = Math.hypot(monster.x - impactX, monster.y - impactY);
        if (dist <= stats.blastRadius) {
          monster.slowTimer = Math.max(monster.slowTimer, 0.45);
          monster.x = Math.min(1535, monster.x + (monsterTypes[monster.typeKey].boss ? 8 : 22));
          damageMonster(monster, dmg);
        }
      });
    } else {
      const muzzle = getWeaponMuzzleWorldPos(weapon.id);
      const maxReachX = Math.min(WIDTH - 190, player.x + stats.range);
      monsters.forEach(monster => {
        const dx = monster.x - player.x;
        const extra = monsterTypes[monster.typeKey].boss ? 18 : 0;
        if (!monster.dead && dx > 20 && monster.x <= maxReachX && Math.abs(monster.y - player.y) <= stats.laneWidth + extra) {
          hits.push(monster);
        }
      });
      if (weapon.id === 3 || weapon.id === 9) {
        projectiles.push({
          startX: muzzle.x,
          x: muzzle.x,
          endX: maxReachX,
          y: muzzle.y + (weapon.id === 9 ? (Math.random() - 0.5) * 16 : 0),
          life: 0.28,
          maxLife: 0.28,
          weaponId: weapon.id
        });
      } else {
        projectiles.push({
          startX: muzzle.x,
          x: muzzle.x,
          endX: maxReachX,
          y: muzzle.y + (weapon.id === 7 ? (Math.random() - 0.5) * 10 : 0),
          life: 0.16,
          maxLife: 0.16,
          weaponId: weapon.id
        });
      }
      hits.forEach(monster => {
        if (weapon.knockback) {
          monster.x = Math.min(1535, monster.x + (monsterTypes[monster.typeKey].boss ? weapon.knockback * 0.4 : weapon.knockback));
        }
        damageMonster(monster, dmg);
      });
    }
  }

  function damageMonster(monster, amount) {
    monster.hp -= amount;
    monster.hurt = 0.12;
    hitBursts.push({ x: monster.x, y: monster.y - 25, life: 0.24, maxLife: 0.24 });
    if (monster.hp <= 0 && !monster.dead) {
      monster.dead = true;
      defeated += 1;
      resolvedCount += 1;
      gold += monster.reward;
      levelEarned += monster.reward;
      floatingTexts.push({
        x: monster.x,
        y: monster.y - 60,
        text: `+$${monster.reward}`,
        color: "#ffd64b",
        life: 0.75,
        maxLife: 0.75
      });
      updateHUD();
    }
  }

  function damageGate(amount, label = "") {
    if (devMode && devSandbox) {
      gateHp = MAX_GATE_HP;
      hitBursts.push({ x: GATE.x + 20, y: GATE.y - 45, life: 0.35, maxLife: 0.35 });
      floatingTexts.push({
        x: GATE.x + 55,
        y: GATE.y - 85,
        text: `${label ? `${label} ` : ""}測試無敵 (-${amount})`,
        color: "#68d391",
        life: 0.9,
        maxLife: 0.9
      });
      updateHUD();
      return;
    }
    gateHp = Math.max(0, gateHp - amount);
    hitBursts.push({ x: GATE.x + 20, y: GATE.y - 45, life: 0.35, maxLife: 0.35 });
    floatingTexts.push({
      x: GATE.x + 55,
      y: GATE.y - 85,
      text: `${label ? `${label} ` : ""}城門 -${amount}`,
      color: "#ff5a47",
      life: 1.05,
      maxLife: 1.05
    });
    updateHUD();
    if (gateHp <= 0 && state === "playing") {
      loseLevel();
    }
  }

  function castMageSpell(monster) {
    monster.casted = true;
    const spells = monsterTypes.mage.spells;
    const spell = spells[Math.floor(Math.random() * spells.length)];
    const dx = GATE.x - monster.x;
    const dy = (GATE.y - 35) - (monster.y - 50);
    const dist = Math.hypot(dx, dy) || 1;
    const speed = 420;
    enemySpells.push({
      x: monster.x - 20,
      y: monster.y - 50,
      vx: (dx / dist) * speed,
      vy: (dy / dist) * speed,
      dmg: spell.dmg,
      name: spell.name,
      color: spell.color
    });
    floatingTexts.push({
      x: monster.x,
      y: monster.y - 105,
      text: `詠唱：${spell.name}！`,
      color: spell.color,
      life: 0.9,
      maxLife: 0.9
    });
  }

  function update(dt) {
    elapsed += dt;
    attackFlash = Math.max(0, attackFlash - dt);
    attackClock = Math.max(0, attackClock - dt);
    shake = Math.max(0, shake - dt);

    hitBursts.forEach(burst => { burst.life -= dt; });
    hitBursts = hitBursts.filter(burst => burst.life > 0);

    explosions.forEach(exp => { exp.life -= dt; });
    explosions = explosions.filter(exp => exp.life > 0);

    projectiles.forEach(shot => {
      shot.life -= dt;
      if ((shot.weaponId === 3 || shot.weaponId === 9) && shot.maxLife) {
        const progress = Math.min(1, 1 - shot.life / shot.maxLife);
        shot.x = shot.startX + (shot.endX - shot.startX) * progress;
      } else {
        shot.x = Math.min(shot.endX - 8, shot.x + dt * 1550);
      }
    });
    projectiles = projectiles.filter(shot => shot.life > 0);

    floatingTexts.forEach(ft => { ft.life -= dt; ft.y -= dt * 38; });
    floatingTexts = floatingTexts.filter(ft => ft.life > 0);

    if (state !== "playing") return;

    let dx = 0;
    let dy = 0;
    if (keys.has("ArrowLeft")) dx -= 1;
    if (keys.has("ArrowRight")) dx += 1;
    if (keys.has("ArrowUp")) dy -= 1;
    if (keys.has("ArrowDown")) dy += 1;
    dx += joystick.x;
    dy += joystick.y;
    const magnitude = Math.hypot(dx, dy);
    if (magnitude > 1) { dx /= magnitude; dy /= magnitude; }
    player.moving = magnitude > 0.08;
    player.moveDirX = dx;
    player.x = Math.max(PLAY_BOUNDS.left, Math.min(PLAY_BOUNDS.right, player.x + dx * player.speed * dt));
    player.y = Math.max(PLAY_BOUNDS.top, Math.min(PLAY_BOUNDS.bottom, player.y + dy * player.speed * dt));

    if (attackHeld && attackClock <= 0) attack();

    if (!(devMode && devSandbox)) {
      spawnClock -= dt;
      if (spawnQueue.length && spawnClock <= 0) {
        spawnMonster(spawnQueue.shift());
        spawnClock += levels[level].spawnInterval;
      }
    }

    for (let i = enemySpells.length - 1; i >= 0; i -= 1) {
      const sp = enemySpells[i];
      sp.x += sp.vx * dt;
      sp.y += sp.vy * dt;
      if (sp.x <= GATE.x + 20) {
        enemySpells.splice(i, 1);
        damageGate(sp.dmg, sp.name);
        if (state !== "playing") return;
      }
    }

    for (const monster of monsters) {
      if (monster.dead) continue;
      monster.hurt = Math.max(0, monster.hurt - dt);
      monster.slowTimer = Math.max(0, monster.slowTimer - dt);
      const speedMult = monster.slowTimer > 0 ? 0.42 : 1;

      monster.x += monster.vx * speedMult * dt;
      monster.y += monster.vy * speedMult * dt;

      if (monsterTypes[monster.typeKey].agile) {
        monster.y += Math.sin((elapsed - monster.spawnTime) * 6.5) * 42 * dt;
        monster.y = Math.max(PLAY_BOUNDS.top + 20, Math.min(PLAY_BOUNDS.bottom, monster.y));
      }

      if (monster.typeKey === "mage" && !monster.casted && monster.x <= 760) {
        castMageSpell(monster);
      }

      if (monster.x <= GATE.x + 15) {
        monster.dead = true;
        resolvedCount += 1;
        damageGate(monster.attack, monsterTypes[monster.typeKey].name);
        if (state !== "playing") return;
      }
    }

    monsters = monsters.filter(monster => !monster.dead);

    if (!(devMode && devSandbox) && !spawnQueue.length && !monsters.length && !enemySpells.length && gateHp > 0) {
      winLevel();
    }
  }

  function loseLevel() {
    state = "result";
    attackHeld = false;
    showControls(false);
    ui["result-badge"].textContent = "!";
    ui["result-badge"].style.background = "var(--yellow)";
    ui["result-kicker"].textContent = `第 ${level} 關 · 城門失守`;
    ui["result-title"].textContent = "城門耐久度歸零！";
    ui["result-copy"].textContent = "別氣餒！本關擊斃怪物賺到的金幣已全數入袋保留，可隨時開啟補給小舖購買或強化武器再挑戰！";
    ui["result-stats"].innerHTML = `
      <div><strong>${defeated}</strong><span>親手擊斃</span></div>
      <div><strong>+$${levelEarned}</strong><span>本關保留金幣</span></div>
      <div><strong>$${gold}</strong><span>目前持有金幣</span></div>
    `;
    ui["result-button"].innerHTML = '重新挑戰本關 <span>↻</span>';
    ui["result-button"].dataset.action = "retry";
    if (ui["result-shop-button"]) ui["result-shop-button"].classList.remove("is-hidden");
    setScreen("result-screen");
    updateHUD();
  }

  function winLevel() {
    attackHeld = false;
    showControls(false);
    lastBonus = gateHp === MAX_GATE_HP ? Math.round(levelEarned * 0.1) : 0;
    if (lastBonus > 0) {
      gold += lastBonus;
    }

    if (level < TOTAL_LEVELS) {
      openShop("win");
      return;
    }

    state = "complete";
    ui["result-badge"].textContent = "👑";
    ui["result-badge"].style.background = "#bce88f";
    ui["result-kicker"].textContent = "八關戰役全數通關！";
    ui["result-title"].textContent = "傳奇蛋仔守城指揮官！";
    ui["result-copy"].textContent = "你成功擊潰刀之首領與 AI-Gemini 率領的十種怪物大軍，完美守護了蛋仔王國！";
    ui["result-stats"].innerHTML = `
      <div><strong>8 / 8</strong><span>通關戰役</span></div>
      <div><strong>${gateHp} HP</strong><span>最終城門耐久</span></div>
      <div><strong>$${gold}</strong><span>結餘金幣</span></div>
      <div><strong>${owned.size} / ${weapons.length}</strong><span>解鎖武器</span></div>
    `;
    ui["result-button"].innerHTML = '再玩一局 <span>↻</span>';
    ui["result-button"].dataset.action = "new-game";
    if (ui["result-shop-button"]) ui["result-shop-button"].classList.add("is-hidden");
    setScreen("result-screen");
  }

  function showShopFeedback(html) {
    if (!ui["shop-feedback"]) return;
    if (!html) {
      ui["shop-feedback"].classList.add("is-hidden");
      ui["shop-feedback"].innerHTML = "";
      return;
    }
    ui["shop-feedback"].innerHTML = html;
    ui["shop-feedback"].classList.remove("is-hidden");
  }

  function openShop(origin = "win") {
    shopOrigin = origin;
    state = "shop";
    attackHeld = false;
    lastUpgradedWeaponId = null;
    showShopFeedback("");
    ui["attack-button"].classList.remove("is-pressed");
    setScreen("shop-screen");

    // Automatically open the page containing the currently equipped weapon
    shopPage = Math.floor(selectedWeaponId / SHOP_PAGE_SIZE);

    if (origin === "playing" || origin === "paused") {
      ui["shop-kicker"].textContent = `第 ${level} / ${TOTAL_LEVELS} 關戰鬥中 · 隨身補給小舖`;
      ui["shop-subtitle"].textContent = "隨時使用打到的金幣購買新武器或升星強化，關閉後直接返回戰場！";
      ui["finish-shop-button"].innerHTML = '返回戰場繼續守城 <span>→</span>';
    } else if (origin === "selecting") {
      ui["shop-kicker"].textContent = `第 ${level} / ${TOTAL_LEVELS} 關戰前準備 · 隨身補給小舖`;
      ui["shop-subtitle"].textContent = "開戰前可隨時採購新武器或將主力武器升星強化！";
      ui["finish-shop-button"].innerHTML = '返回出戰準備 <span>→</span>';
    } else if (origin === "result") {
      ui["shop-kicker"].textContent = `第 ${level} / ${TOTAL_LEVELS} 關重整旗鼓 · 已保留本關金幣 +$${levelEarned}`;
      ui["shop-subtitle"].textContent = "使用剛才累積的金幣購買新武器或升星強化，準備好後再次挑戰！";
      ui["finish-shop-button"].innerHTML = `準備重新挑戰第 ${level} 關 <span>→</span>`;
    } else {
      const bonusText = lastBonus > 0 ? `（含完美無傷守城獎金 +$${lastBonus}！）` : `（剩餘城門耐久 ${gateHp}/${MAX_GATE_HP}）`;
      ui["shop-kicker"].textContent = `第 ${level} / ${TOTAL_LEVELS} 關守城成功 · 本關進帳 $${levelEarned + lastBonus} ${bonusText}`;
      ui["shop-subtitle"].textContent = `即將進入第 ${level + 1} 關「${levels[level + 1].title}」——採購新武器或將主力武器升星強化！`;
      ui["finish-shop-button"].innerHTML = '前往下一關準備 <span>→</span>';
    }
    renderShop();
  }

  function renderShop() {
    ui["shop-gold"].textContent = gold;
    const totalPages = Math.ceil(weapons.length / SHOP_PAGE_SIZE);
    shopPage = Math.max(0, Math.min(totalPages - 1, shopPage));
    const pageWeapons = weapons.slice(shopPage * SHOP_PAGE_SIZE, (shopPage + 1) * SHOP_PAGE_SIZE);

    if (ui["shop-tabs"]) {
      ui["shop-tabs"].querySelectorAll("[data-shop-page]").forEach(tab => {
        tab.classList.toggle("is-active", Number(tab.dataset.shopPage) === shopPage);
      });
    }
    if (ui["shop-page-indicator"]) {
      ui["shop-page-indicator"].textContent = `第 ${shopPage + 1} / ${totalPages} 頁`;
    }
    if (ui["shop-prev-page"]) {
      ui["shop-prev-page"].disabled = shopPage <= 0;
      ui["shop-prev-page"].classList.toggle("is-invisible", shopPage <= 0);
    }
    if (ui["shop-next-page"]) {
      ui["shop-next-page"].disabled = shopPage >= totalPages - 1;
      ui["shop-next-page"].classList.toggle("is-invisible", shopPage >= totalPages - 1);
    }

    ui["shop-list"].innerHTML = pageWeapons.map(weapon => {
      const isOwned = owned.has(weapon.id);
      const tier = getWeaponTier(weapon.id);
      const cur = getWeaponStatsForTier(weapon.id, tier);
      const art = weapon.icon
        ? `<img src="${weapon.icon}" alt="${weapon.name}" />`
        : '<div class="fist-shop-art">✊</div>';

      let upgradeDetailMarkup = "";
      let actionButton = "";

      if (!isOwned) {
        const canBuy = gold >= weapon.price;
        actionButton = `<button class="buy-button" type="button" data-buy="${weapon.id}" ${canBuy ? "" : "disabled"}>購買武器 ($ ${weapon.price})</button>`;
      } else {
        const upgCost = getUpgradePrice(weapon.id);
        if (upgCost !== null) {
          const next = getWeaponStatsForTier(weapon.id, tier + 1);
          const canUpg = gold >= upgCost;
          upgradeDetailMarkup = `<div class="upgrade-simple-hint">⬆️ 強化後：⚔️ <b>${cur.damage}→${next.damage}</b> · ⚡ <b>${cur.attackSpeed}→${next.attackSpeed}/秒</b> · 🎯 射程 <b>${cur.range}→${next.range}</b></div>`;
          actionButton = `<button class="buy-button upgrade-btn" type="button" data-upgrade="${weapon.id}" ${canUpg ? "" : "disabled"}>強化升至 ★${tier + 1} ($ ${upgCost})</button>`;
        } else {
          upgradeDetailMarkup = `<div class="upgrade-max-box">👑 已達最高 ★3 星級（傷害、攻速與射程皆為最高）</div>`;
          actionButton = `<button class="buy-button" type="button" disabled>★3 已滿級強化</button>`;
        }
      }

      const isJustUpgraded = lastUpgradedWeaponId === weapon.id;
      const badgeLabel = isOwned ? `★${tier}` : "未擁有";

      return `<article class="shop-item${isOwned ? " is-owned" : ""}${isJustUpgraded ? " just-upgraded" : ""}">
        ${art}
        <div>
          <h3><span>${weapon.name}</span><span class="tier-badge${tier >= 3 && isOwned ? " is-max" : ""}">${badgeLabel}</span></h3>
          <div class="stat-pills-row">
            <span class="stat-attack-pill">⚔️ 攻擊力 ${cur.damage}</span>
            <span class="stat-speed-pill">⚡ 攻速 ${cur.attackSpeed} 次/秒</span>
            <span class="stat-range-pill">🎯 射程 ${cur.range}</span>
          </div>
          <p>${weapon.desc}</p>
          ${upgradeDetailMarkup}
          ${actionButton}
        </div>
      </article>`;
    }).join("");

    ui["shop-list"].querySelectorAll("[data-buy]").forEach(button => {
      button.addEventListener("click", () => buyWeapon(Number(button.dataset.buy)));
    });
    ui["shop-list"].querySelectorAll("[data-upgrade]").forEach(button => {
      button.addEventListener("click", () => upgradeWeapon(Number(button.dataset.upgrade)));
    });
  }

  function buyWeapon(id) {
    const weapon = weapons[id];
    if (owned.has(id) || gold < weapon.price) return;
    gold -= weapon.price;
    owned.add(id);
    weaponTiers[id] = 1;
    selectedWeaponId = id;
    lastUpgradedWeaponId = id;
    const cur = getWeaponStatsForTier(id, 1);
    showShopFeedback(
      `<span>🎉 已購買並裝備【${weapon.name} ★1】！</span>` +
      `<span>⚔️ 攻擊力 ${cur.damage} · ⚡ 攻速 ${cur.attackSpeed} 次/秒 · ${weapon.desc}</span>`
    );
    renderShop();
    updateHUD();
  }

  function upgradeWeapon(id) {
    if (!owned.has(id)) return;
    const cost = getUpgradePrice(id);
    if (cost === null || gold < cost) return;
    const prevTier = getWeaponTier(id);
    const prevStats = getWeaponStatsForTier(id, prevTier);
    const nextTier = prevTier + 1;
    const nextStats = getWeaponStatsForTier(id, nextTier);

    gold -= cost;
    weaponTiers[id] = nextTier;
    selectedWeaponId = id;
    lastUpgradedWeaponId = id;

    const weapon = weapons[id];
    showShopFeedback(
      `<span>✨ 強化成功！【${weapon.name}】升至 ★${nextTier}！</span>` +
      `<span>⚔️ 攻擊力 ${prevStats.damage} → ${nextStats.damage} · ⚡ 攻速 ${prevStats.attackSpeed} → ${nextStats.attackSpeed} 次/秒</span>`
    );
    floatingTexts.push({
      x: player.x,
      y: player.y - 130,
      text: `${weapon.name} 升至 ★${nextTier}！(⚔️${nextStats.damage})`,
      color: "#ffd64b",
      life: 1.1,
      maxLife: 1.1
    });
    renderShop();
    updateHUD();
  }

  function finishShop() {
    const highestOwned = [...owned].sort((a, b) => a - b).at(-1) || 0;
    if (!owned.has(selectedWeaponId)) selectedWeaponId = highestOwned;

    if (shopOrigin === "playing" || shopOrigin === "paused") {
      state = "playing";
      setScreen(null);
      showControls(true);
      updateHUD();
      lastTime = performance.now();
      return;
    }

    if (shopOrigin === "selecting" || shopOrigin === "result") {
      openWeaponSelection();
      return;
    }

    level += 1;
    openWeaponSelection();
  }

  function newGame() {
    level = 1;
    gold = 0;
    gateHp = MAX_GATE_HP;
    owned = new Set([0]);
    weaponTiers = { 0: 1 };
    selectedWeaponId = 0;
    openWeaponSelection();
  }

  function togglePause(forceResume = false) {
    if (state === "playing" && !forceResume) {
      state = "paused";
      attackHeld = false;
      ui["attack-button"].classList.remove("is-pressed");
      setScreen("pause-screen");
    } else if (state === "paused") {
      state = "playing";
      setScreen(null);
      lastTime = performance.now();
    }
  }

  function drawImageCover(image) {
    if (!image) { ctx.fillStyle = "#87d64b"; ctx.fillRect(0, 0, WIDTH, HEIGHT); return; }
    const scale = Math.max(WIDTH / image.width, HEIGHT / image.height);
    const w = image.width * scale;
    const h = image.height * scale;
    ctx.drawImage(image, (WIDTH - w) / 2, (HEIGHT - h) / 2, w, h);
  }

  function draw() {
    ctx.save();
    drawImageCover(images.background);

    ctx.fillStyle = "rgba(15,48,24,.13)";
    ctx.beginPath();
    if (selectedWeaponId === 10) {
      ctx.ellipse(player.x + 18, player.y + 42, 108, 22, 0, 0, Math.PI * 2);
    } else {
      ctx.ellipse(player.x, player.y + 46, 46, 14, 0, 0, Math.PI * 2);
    }
    ctx.fill();

    const drawables = [
      ...monsters.map(monster => ({ type: "monster", y: monster.y, data: monster })),
      { type: "player", y: player.y, data: player }
    ].sort((a, b) => a.y - b.y);

    drawables.forEach(item => (item.type === "player" ? drawPlayer() : drawMonster(item.data)));
    drawAttacks();
    drawExplosions();
    drawEnemySpells();
    drawBursts();
    drawGateWarning();
    drawFloatingTexts();
    ctx.restore();
  }

  function drawPlayer() {
    const isPlaying = state === "playing";
    const isMoving = isPlaying && player.moving;
    const attackProgress = attackFlash > 0 ? (attackFlash / 0.15) : 0;
    const weapon = weapons[selectedWeaponId];

    // Special Mounted Vehicle Mode for Weapon 10 (Patriot Missile Rig)
    if (selectedWeaponId === 10 && images["weapon-10"]) {
      const engineHum = isMoving ? Math.sin(elapsed * 26) * 1.8 : Math.sin(elapsed * 7) * 0.8;
      const vehicleTilt = isMoving ? player.moveDirX * 0.02 : 0;
      const podRecoil = attackProgress > 0 ? -Math.sin(attackProgress * Math.PI) * 9 : 0;

      ctx.save();
      ctx.translate(player.x, player.y + engineHum);
      ctx.rotate(vehicleTilt);

      // 1. Rear Operator Deck & Armored High-Back Seat (matching Patriot colors)
      ctx.save();
      ctx.lineWidth = 3.5;
      ctx.strokeStyle = "#0d0f12";

      // Armored seat backrest
      ctx.fillStyle = "#2d3136";
      roundRect(-98, -74, 20, 80, 6);
      ctx.fill();
      ctx.stroke();

      // Glowing orange stripe on seat backrest
      ctx.strokeStyle = "#ff5a1f";
      ctx.lineWidth = 2.2;
      ctx.beginPath();
      ctx.moveTo(-91, -66);
      ctx.lineTo(-91, -6);
      ctx.stroke();

      // Seat cushion
      ctx.strokeStyle = "#0d0f12";
      ctx.lineWidth = 3.2;
      ctx.fillStyle = "#3c4148";
      roundRect(-84, -14, 34, 14, 5);
      ctx.fill();
      ctx.stroke();

      // Extended rear tracked chassis deck
      ctx.fillStyle = "#787a58";
      roundRect(-98, 2, 86, 35, 8);
      ctx.fill();
      ctx.stroke();

      // Dark gunmetal inner panel on rear deck
      ctx.fillStyle = "#2d3136";
      roundRect(-92, 8, 74, 24, 5);
      ctx.fill();
      ctx.stroke();

      // Two glowing cyan hover-wheels under the operator seat deck
      [-74, -46].forEach(wx => {
        ctx.fillStyle = "#124e59";
        ctx.beginPath();
        ctx.arc(wx, 20, 10, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();

        ctx.fillStyle = "#18f0ff";
        ctx.beginPath();
        ctx.arc(wx, 20, 6.5, 0, Math.PI * 2);
        ctx.fill();
      });
      ctx.restore();

      // 2. Player Character Sitting on the Operator Seat
      ctx.save();
      // Seated bent legs (purple pants + navy shoes on foot pedal)
      ctx.lineWidth = 3.2;
      ctx.strokeStyle = "#12206c";
      ctx.fillStyle = "#7c34cc";
      // Thighs + lower legs bent on seat
      ctx.beginPath();
      ctx.moveTo(-74, -18);
      ctx.lineTo(-42, -16);
      ctx.lineTo(-38, 2);
      ctx.lineTo(-52, 2);
      ctx.lineTo(-55, -7);
      ctx.lineTo(-74, -7);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();

      // Navy shoe resting on cockpit pedal
      ctx.fillStyle = "#144892";
      roundRect(-50, -1, 20, 10, 4);
      ctx.fill();
      ctx.stroke();

      // Upper body & head of main character (cropped above standing legs so legs are seated)
      if (images.player) {
        const srcW = images.player.width;
        const srcH = Math.round(images.player.height * 0.65);
        ctx.drawImage(images.player, 0, 0, srcW, srcH, -94, -88, 72, 68);
      }
      ctx.restore();

      // 3. Operator Control Console, Radar Screen & Dual Joysticks
      ctx.save();
      ctx.lineWidth = 3.2;
      ctx.strokeStyle = "#0d0f12";
      ctx.fillStyle = "#6e7150";
      ctx.beginPath();
      ctx.moveTo(-40, 4);
      ctx.lineTo(-34, -48);
      ctx.lineTo(-14, -48);
      ctx.lineTo(-10, 4);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();

      // Glowing tactical screen facing the operator
      ctx.fillStyle = attackProgress > 0 ? "#ffd64b" : "#18f0ff";
      roundRect(-38, -44, 14, 12, 3);
      ctx.fill();
      ctx.stroke();

      // Twin joystick levers + operator hands gripping them
      ctx.strokeStyle = "#0d0f12";
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(-31, -44);
      ctx.lineTo(-36 + (attackProgress > 0 ? -3 : 0), -56);
      ctx.moveTo(-21, -44);
      ctx.lineTo(-26 + (attackProgress > 0 ? -3 : 0), -54);
      ctx.stroke();

      // Joystick red-orange handles
      ctx.fillStyle = "#ff5a1f";
      ctx.beginPath();
      ctx.arc(-36 + (attackProgress > 0 ? -3 : 0), -57, 4.2, 0, Math.PI * 2);
      ctx.arc(-26 + (attackProgress > 0 ? -3 : 0), -55, 4.2, 0, Math.PI * 2);
      ctx.fill();

      // Player's hands on the control levers
      ctx.fillStyle = "#ffcea8";
      ctx.strokeStyle = "#12206c";
      ctx.lineWidth = 2.2;
      ctx.beginPath();
      ctx.ellipse(-36 + (attackProgress > 0 ? -3 : 0), -53, 5.5, 4.5, 0.15, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();
      ctx.restore();

      // 4. Giant Mounted Patriot Missile Launcher Rig (10-patriot.png at vehicle scale)
      ctx.save();
      ctx.translate(-26 + podRecoil, -96);
      ctx.scale(-1, 1);
      ctx.drawImage(images["weapon-10"], -186, 0, 186, 138);
      ctx.restore();

      // Muzzle flash from twin missile tubes when firing
      if (attackProgress > 0) {
        ctx.save();
        ctx.globalAlpha = attackProgress;
        ctx.fillStyle = "#ff9c38";
        ctx.beginPath();
        ctx.arc(126 + podRecoil, -22, 16, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = "#fff6b0";
        ctx.beginPath();
        ctx.arc(126 + podRecoil, -22, 9, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      }

      ctx.restore();
      return;
    }

    const walkWave = isMoving ? Math.sin(elapsed * 15) : 0;
    const stepBounce = isMoving ? Math.abs(Math.sin(elapsed * 15)) * 4.5 : Math.sin(elapsed * 4.5) * 1.8;
    const bodyTilt = isMoving ? (player.moveDirX * 0.045 + walkWave * 0.035) : Math.sin(elapsed * 3.2) * 0.012;

    // Subtle squash & stretch + attack lunge
    const lungeX = attackProgress > 0 ? (weapon.melee ? Math.sin(attackProgress * Math.PI) * 7 : -attackProgress * 3.5) : 0;
    const scaleY = isMoving ? (1 + Math.sin(elapsed * 30) * 0.025) : (1 + Math.sin(elapsed * 4.5) * 0.018);
    const scaleX = 2 - scaleY;

    ctx.save();
    ctx.translate(player.x + lungeX, player.y - stepBounce);
    ctx.rotate(bodyTilt);
    ctx.scale(scaleX, scaleY);

    if (images.player) {
      ctx.drawImage(images.player, -player.width / 2, -player.height, player.width, player.height);
    }

    // Right hand anchor point directly on the character's right hand (zero gap!)
    const handX = player.width * 0.21;
    const handY = -player.height * 0.47;

    if (weapon.icon && images[`weapon-${weapon.id}`]) {
      const cfg = weaponHoldConfigs[weapon.id] || { w: 76, h: 48, gripX: 22, gripY: 26, angle: -0.04 };
      const swingRot = attackProgress > 0
        ? (weapon.melee
          ? Math.sin((1 - attackProgress) * Math.PI) * 1.05 - 0.35
          : weapon.id === 9
            ? Math.sin((1 - attackProgress) * Math.PI) * 0.45 - 0.15
            : -attackProgress * 0.14)
        : 0;
      const recoilX = (!weapon.melee && attackProgress > 0)
        ? (weapon.id === 9 ? Math.sin((1 - attackProgress) * Math.PI) * 14 : -attackProgress * 5)
        : 0;

      ctx.save();
      ctx.translate(handX + recoilX, handY);
      ctx.rotate(cfg.angle + swingRot);
      if (weapon.flipInHand) {
        ctx.save();
        ctx.scale(-1, 1);
        ctx.drawImage(images[`weapon-${weapon.id}`], -(cfg.w - cfg.gripX), -cfg.gripY, cfg.w, cfg.h);
        ctx.restore();
      } else {
        ctx.drawImage(images[`weapon-${weapon.id}`], -cfg.gripX, -cfg.gripY, cfg.w, cfg.h);
      }

      // If holding Bow (weapon 3), draw a nocked arrow on the bow
      if (weapon.id === 3) {
        const pullBack = attackProgress > 0 ? -attackProgress * 10 : 0;
        ctx.save();
        ctx.translate(pullBack, 0);
        // Arrow shaft on bow
        ctx.strokeStyle = "#6b3e1b";
        ctx.lineWidth = 3.2;
        ctx.beginPath();
        ctx.moveTo(-24, 0);
        ctx.lineTo(14, 0);
        ctx.stroke();
        // Steel arrowhead on bow
        ctx.fillStyle = "#e2e8f0";
        ctx.strokeStyle = "#17241f";
        ctx.lineWidth = 1.8;
        ctx.beginPath();
        ctx.moveTo(22, 0);
        ctx.lineTo(11, -5);
        ctx.lineTo(13, 0);
        ctx.lineTo(11, 5);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();
        ctx.restore();
      }

      // Draw muzzle flash directly at the gun barrel tip (muzzleX, muzzleY) when firing firearms/launchers
      if (!weapon.melee && weapon.id !== 3 && weapon.id !== 9 && attackProgress > 0 && cfg.muzzleX !== undefined) {
        ctx.save();
        ctx.translate(cfg.muzzleX, cfg.muzzleY);
        ctx.globalAlpha = Math.min(1, attackProgress * 1.25);
        const flashRadius = weapon.id === 8 || weapon.id === 11 || weapon.id === 5 ? 14 : 10;
        ctx.fillStyle = weapon.id === 8 ? "#38bdf8" : "#ff8c24";
        ctx.beginPath();
        ctx.moveTo(0, -flashRadius * 0.65);
        ctx.lineTo(flashRadius * 1.85, 0);
        ctx.lineTo(0, flashRadius * 0.65);
        ctx.closePath();
        ctx.fill();
        ctx.beginPath();
        ctx.arc(2, 0, flashRadius * 0.72, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = "#fff9c4";
        ctx.beginPath();
        ctx.arc(3, 0, flashRadius * 0.42, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      }

      // Draw fingers/hand clasping over the weapon grip so it looks genuinely held in hand
      ctx.fillStyle = "#ffcea8";
      ctx.strokeStyle = "#12206c";
      ctx.lineWidth = 2.4;
      ctx.beginPath();
      ctx.ellipse(0, 1, 6.2, 5.2, 0.2, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();
      ctx.restore();
    } else if (selectedWeaponId === 0 && attackProgress > 0) {
      // Fist punch glove effect when attacking with bare hands
      ctx.save();
      ctx.translate(handX + Math.sin(attackProgress * Math.PI) * 16, handY - 2);
      ctx.fillStyle = "#ffcea8";
      ctx.strokeStyle = "#12206c";
      ctx.lineWidth = 2.8;
      ctx.beginPath();
      ctx.arc(0, 0, 8.5, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();
      ctx.restore();
    }

    ctx.restore();
  }

  function drawMonster(monster) {
    const type = monsterTypes[monster.typeKey];
    const image = images[monster.typeKey];
    const bobFreq = type.float ? 4.5 : 7;
    const bobAmp = type.float ? 6 : 2.5;
    const bob = Math.sin(elapsed * bobFreq + monster.x * 0.03) * bobAmp;

    ctx.fillStyle = "rgba(15,48,24,.12)";
    ctx.beginPath();
    ctx.ellipse(monster.x, monster.y + 6, type.width * 0.34, 11, 0, 0, Math.PI * 2);
    ctx.fill();

    ctx.save();
    if (monster.hurt > 0) {
      ctx.globalAlpha = 0.62;
      ctx.filter = "brightness(1.8) saturate(.3)";
    } else if (monster.slowTimer > 0) {
      ctx.filter = "hue-rotate(170deg) saturate(1.4)";
    }
    if (image) {
      ctx.drawImage(image, monster.x - type.width / 2, monster.y - type.height + bob, type.width, type.height);
    }
    ctx.restore();

    const barWidth = Math.max(84, type.width * 0.78);
    const barX = monster.x - barWidth / 2;
    const barY = monster.y - type.height - 18;
    ctx.fillStyle = "#17241f";
    roundRect(barX - 3, barY - 3, barWidth + 6, 13, 6);
    ctx.fill();
    ctx.fillStyle = "#f5eeda";
    roundRect(barX, barY, barWidth, 7, 4);
    ctx.fill();
    ctx.fillStyle = monster.hp / monster.maxHp < 0.35 ? "#f04e3c" : type.boss ? "#9f7aea" : "#4cab55";
    roundRect(barX, barY, barWidth * Math.max(0, monster.hp / monster.maxHp), 7, 4);
    ctx.fill();
  }

  function drawAttacks() {
    if (attackFlash > 0 && weapons[selectedWeaponId].melee) {
      ctx.save();
      ctx.globalAlpha = attackFlash / 0.15;
      ctx.strokeStyle = selectedWeaponId === 0 ? "#fff4c6" : "#ffd64b";
      ctx.lineWidth = 22;
      ctx.lineCap = "round";
      const meleeStats = getWeaponStatsForTier(selectedWeaponId);
      ctx.beginPath();
      ctx.arc(player.x + 35, player.y - 43, meleeStats.range * 0.64, -1.05, 0.72);
      ctx.stroke();
      ctx.strokeStyle = "rgba(255,113,61,.85)";
      ctx.lineWidth = 6;
      ctx.stroke();
      ctx.restore();
    }
    projectiles.forEach(shot => {
      if (shot.weaponId === 3) {
        const fade = shot.life < 0.06 ? shot.life / 0.06 : 1;
        ctx.save();
        ctx.globalAlpha = Math.max(0, fade);

        // Subtle wind trail behind the flying arrow
        const trailStart = Math.max(shot.startX || (shot.x - 70), shot.x - 85);
        if (shot.x > trailStart + 12) {
          ctx.strokeStyle = "rgba(255, 244, 184, 0.55)";
          ctx.lineWidth = 4;
          ctx.lineCap = "round";
          ctx.beginPath();
          ctx.moveTo(trailStart, shot.y);
          ctx.lineTo(shot.x - 28, shot.y);
          ctx.stroke();
        }

        // Draw actual flying Arrow (箭矢)
        ctx.translate(shot.x, shot.y);

        // Feather fletching (紅白箭羽) at tail
        ctx.fillStyle = "#ef4444";
        ctx.strokeStyle = "#17241f";
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(-34, 0);
        ctx.lineTo(-44, -7);
        ctx.lineTo(-24, -7);
        ctx.lineTo(-18, 0);
        ctx.lineTo(-24, 7);
        ctx.lineTo(-44, 7);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();

        // Wooden arrow shaft (箭桿)
        ctx.strokeStyle = "#17241f";
        ctx.lineWidth = 6.5;
        ctx.lineCap = "round";
        ctx.beginPath();
        ctx.moveTo(-34, 0);
        ctx.lineTo(14, 0);
        ctx.stroke();

        ctx.strokeStyle = "#9c5a25";
        ctx.lineWidth = 3.6;
        ctx.beginPath();
        ctx.moveTo(-34, 0);
        ctx.lineTo(14, 0);
        ctx.stroke();

        // Sharp steel arrowhead (銀白箭鏃)
        ctx.fillStyle = "#f1f5f9";
        ctx.strokeStyle = "#17241f";
        ctx.lineWidth = 2.4;
        ctx.beginPath();
        ctx.moveTo(30, 0);
        ctx.lineTo(10, -8);
        ctx.lineTo(14, 0);
        ctx.lineTo(10, 8);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();

        ctx.restore();
        return;
      }

      if (shot.weaponId === 9 && images["weapon-9"]) {
        const fade = shot.life < 0.06 ? shot.life / 0.06 : 1;
        ctx.save();
        ctx.globalAlpha = Math.max(0, fade);

        // Wind trail behind the flying throwing knife
        const trailStart = Math.max(shot.startX || (shot.x - 80), shot.x - 90);
        if (shot.x > trailStart + 10) {
          ctx.strokeStyle = "rgba(125, 211, 252, 0.52)";
          ctx.lineWidth = 6;
          ctx.lineCap = "round";
          ctx.beginPath();
          ctx.moveTo(trailStart, shot.y);
          ctx.lineTo(shot.x - 16, shot.y);
          ctx.stroke();
        }

        // Draw the actual throwing knife image flying forward
        ctx.drawImage(images["weapon-9"], shot.x - 42, shot.y - 18, 84, 36);
        ctx.restore();
        return;
      }

      const alpha = Math.max(0, shot.life / 0.16);
      ctx.save();
      ctx.globalAlpha = alpha;
      ctx.strokeStyle =
        shot.weaponId === 3 ? "#f6e8b0" :
        shot.weaponId === 5 ? "#ff9c38" :
        shot.weaponId === 7 ? "#ffea79" :
        shot.weaponId === 8 ? "#38bdf8" :
        shot.weaponId === 9 ? "#7dd3fc" :
        shot.weaponId === 10 ? "#ef4444" :
        shot.weaponId === 11 ? "#f97316" :
        "#fff8d9";
      ctx.lineWidth =
        shot.weaponId === 10 ? 18 :
        shot.weaponId === 11 ? 16 :
        shot.weaponId === 5 ? 14 :
        shot.weaponId === 8 ? 11 :
        shot.weaponId === 7 ? 10 :
        shot.weaponId === 9 ? 9 : 6;
      ctx.lineCap = "round";
      ctx.beginPath();
      ctx.moveTo(shot.x, shot.y);
      ctx.lineTo(shot.endX, shot.y);
      ctx.stroke();

      // End-of-range spark so player clearly sees the weapon's effective distance
      ctx.fillStyle = ctx.strokeStyle;
      ctx.beginPath();
      ctx.arc(shot.endX, shot.y, 6, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    });
  }

  function drawExplosions() {
    explosions.forEach(exp => {
      const progress = 1 - exp.life / exp.maxLife;
      const currentRadius = exp.radius * (0.35 + progress * 0.65);
      ctx.save();
      ctx.globalAlpha = Math.max(0, 1 - progress);
      ctx.fillStyle = "rgba(255, 140, 56, 0.32)";
      ctx.beginPath();
      ctx.arc(exp.x, exp.y, currentRadius, 0, Math.PI * 2);
      ctx.fill();
      ctx.lineWidth = 8;
      ctx.strokeStyle = "#ffd64b";
      ctx.stroke();
      ctx.restore();
    });
  }

  function drawEnemySpells() {
    enemySpells.forEach(sp => {
      ctx.save();
      ctx.fillStyle = sp.color;
      ctx.shadowColor = sp.color;
      ctx.shadowBlur = 14;
      ctx.beginPath();
      ctx.arc(sp.x, sp.y, 14, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = "#ffffff";
      ctx.beginPath();
      ctx.arc(sp.x - 3, sp.y - 3, 5, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    });
  }

  function drawBursts() {
    hitBursts.forEach(burst => {
      const progress = 1 - burst.life / burst.maxLife;
      ctx.save();
      ctx.globalAlpha = 1 - progress;
      ctx.strokeStyle = "#fff7bf";
      ctx.lineWidth = 6;
      for (let i = 0; i < 6; i += 1) {
        const angle = (i * Math.PI) / 3;
        const inner = 16 + progress * 15;
        const outer = 32 + progress * 28;
        ctx.beginPath();
        ctx.moveTo(burst.x + Math.cos(angle) * inner, burst.y + Math.sin(angle) * inner);
        ctx.lineTo(burst.x + Math.cos(angle) * outer, burst.y + Math.sin(angle) * outer);
        ctx.stroke();
      }
      ctx.restore();
    });
  }

  function drawGateWarning() {
    if (state !== "playing" || !monsters.length) return;
    const closest = Math.min(...monsters.map(monster => monster.x));
    if (closest > 490) return;
    const alpha = 0.35 + Math.sin(elapsed * 9) * 0.18;
    ctx.save();
    ctx.globalAlpha = alpha;
    ctx.strokeStyle = "#ff4f35";
    ctx.lineWidth = 10;
    ctx.beginPath();
    ctx.arc(GATE.x, GATE.y - 10, 82, -1.2, 1.2);
    ctx.stroke();
    ctx.restore();
  }

  function drawFloatingTexts() {
    floatingTexts.forEach(ft => {
      ctx.save();
      ctx.globalAlpha = Math.max(0, ft.life / ft.maxLife);
      ctx.font = '900 22px "Noto Sans TC", sans-serif';
      ctx.textAlign = "center";
      ctx.lineWidth = 5;
      ctx.strokeStyle = "#17241f";
      ctx.strokeText(ft.text, ft.x, ft.y);
      ctx.fillStyle = ft.color;
      ctx.fillText(ft.text, ft.x, ft.y);
      ctx.restore();
    });
  }

  function roundRect(x, y, w, h, radius) {
    if (w <= 0) return;
    ctx.beginPath();
    ctx.roundRect(x, y, w, h, Math.min(radius, w / 2, h / 2));
  }

  function frame(now) {
    const dt = Math.min(0.04, (now - lastTime) / 1000);
    lastTime = now;
    update(dt);
    draw();
    requestAnimationFrame(frame);
  }

  function handleKey(event, down) {
    if (["ArrowLeft", "ArrowRight", "ArrowUp", "ArrowDown", "Space"].includes(event.code)) {
      event.preventDefault();
    }
    if (event.code === "Escape" && down && !event.repeat) {
      if (state === "shop" && shopOrigin !== "win") {
        finishShop();
      } else if (state === "playing" || state === "paused") {
        togglePause();
      }
    }
    if (event.code === "KeyB" && down && !event.repeat) {
      if (state === "shop" && shopOrigin !== "win") {
        finishShop();
      } else if (["playing", "paused", "selecting", "result"].includes(state)) {
        openShop(state);
      }
    }
    if (event.code === "KeyQ" && down && !event.repeat && state === "playing") {
      cycleWeapon();
    }
    if (event.code === "Space") attackHeld = down;
    if (down) keys.add(event.code);
    else keys.delete(event.code);
  }

  function updateJoystickFromPoint(clientX, clientY) {
    const ring = ui.joystick.querySelector(".joystick-ring") || ui.joystick;
    const rect = ring.getBoundingClientRect();
    if (!rect.width || !rect.height) return;
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    let dx = clientX - centerX;
    let dy = clientY - centerY;
    const max = rect.width * 0.34;
    const length = Math.hypot(dx, dy);
    if (length > max) {
      dx = (dx / length) * max;
      dy = (dy / length) * max;
    }
    joystick.x = dx / max;
    joystick.y = dy / max;
    ui["joystick-knob"].style.transform = `translate(${dx}px, ${dy}px)`;
  }

  function endJoystick(event) {
    if (event && event.pointerId !== undefined && event.pointerId !== joystick.pointerId) return;
    joystick.pointerId = null;
    joystick.touchId = null;
    joystick.x = 0;
    joystick.y = 0;
    ui["joystick-knob"].style.transform = "translate(0,0)";
  }

  function renderDevPanel() {
    if (!ui["dev-panel"] || !devMode) return;

    if (ui["dev-sandbox-toggle"]) {
      ui["dev-sandbox-toggle"].classList.toggle("is-active", devSandbox);
      ui["dev-sandbox-toggle"].textContent = devSandbox ? "🔒 沙盒無敵：開" : "🔓 沙盒無敵：關";
    }
    if (ui["dev-status-tag"]) {
      ui["dev-status-tag"].textContent = devSandbox
        ? "沙盒測試中（城門不死・停止自動波次・不強制結算）"
        : "正常關卡規則（開啟波次出怪與結算）";
    }

    ui["dev-panel"].querySelectorAll("[data-dev-tier]").forEach(btn => {
      btn.classList.toggle("is-active", Number(btn.dataset.devTier) === devAllTier);
    });
    ui["dev-panel"].querySelectorAll("[data-dev-count]").forEach(btn => {
      btn.classList.toggle("is-active", Number(btn.dataset.devCount) === devSpawnCount);
    });

    if (ui["dev-weapon-grid"]) {
      ui["dev-weapon-grid"].innerHTML = weapons.map(w => {
        const tier = getWeaponTier(w.id);
        const stats = getWeaponStatsForTier(w.id, tier);
        const icon = w.icon ? `<img src="${w.icon}" alt="" />` : "<span>✊</span>";
        const isSel = selectedWeaponId === w.id;
        return `<button class="dev-chip${isSel ? " is-selected" : ""}" type="button" data-dev-weapon="${w.id}">
          ${icon}
          <span>${w.name} ★${tier} (⚔️${stats.damage})</span>
        </button>`;
      }).join("");

      ui["dev-weapon-grid"].querySelectorAll("[data-dev-weapon]").forEach(btn => {
        btn.addEventListener("click", () => {
          const id = Number(btn.dataset.devWeapon);
          owned.add(id);
          if (!weaponTiers[id]) weaponTiers[id] = devAllTier;
          selectedWeaponId = id;
          updateHUD();
          renderDevPanel();
          floatingTexts.push({
            x: player.x,
            y: player.y - 125,
            text: `🛠️ 裝備：${weapons[id].name} ★${getWeaponTier(id)}`,
            color: "#fbd38d",
            life: 0.75,
            maxLife: 0.75
          });
        });
      });
    }

    if (ui["dev-monster-grid"]) {
      ui["dev-monster-grid"].innerHTML = Object.entries(monsterTypes).map(([key, m]) => {
        return `<button class="dev-chip" type="button" data-dev-monster="${key}">
          <img src="${m.image}" alt="" />
          <span>+${m.name} (HP ${m.hp})</span>
        </button>`;
      }).join("");

      ui["dev-monster-grid"].querySelectorAll("[data-dev-monster]").forEach(btn => {
        btn.addEventListener("click", () => {
          const key = btn.dataset.devMonster;
          if (state !== "playing") {
            startLevel();
          }
          for (let i = 0; i < devSpawnCount; i += 1) {
            spawnMonster(key);
          }
          floatingTexts.push({
            x: WIDTH - 240,
            y: 260,
            text: `👾 呼叫：${monsterTypes[key].name} ×${devSpawnCount}`,
            color: "#9ae6b4",
            life: 0.85,
            maxLife: 0.85
          });
        });
      });
    }
  }

  function activateDevMode() {
    devMode = true;
    devSandbox = true;
    weapons.forEach(w => {
      owned.add(w.id);
      weaponTiers[w.id] = devAllTier;
    });
    gold = Math.max(gold, 99999);

    if (state !== "playing") {
      startLevel();
    }
    if (devSandbox) {
      monsters = [];
      enemySpells = [];
    }

    if (ui["dev-panel"]) {
      ui["dev-panel"].classList.remove("is-hidden", "is-minimized");
    }
    if (ui["dev-hud-button"]) {
      ui["dev-hud-button"].classList.remove("is-hidden");
    }
    if (ui["dev-minimize-btn"]) {
      ui["dev-minimize-btn"].textContent = "收合 ▲";
    }

    updateHUD();
    renderDevPanel();

    floatingTexts.push({
      x: WIDTH / 2,
      y: 250,
      text: "🛠️ 開發者模式已啟動！全武器解鎖＆可任意呼叫怪物測試",
      color: "#ffd64b",
      life: 1.8,
      maxLife: 1.8
    });
  }

  function deactivateDevMode() {
    devMode = false;
    if (ui["dev-panel"]) ui["dev-panel"].classList.add("is-hidden");
    if (ui["dev-hud-button"]) ui["dev-hud-button"].classList.add("is-hidden");
    updateHUD();
  }

  document.querySelectorAll("[data-dev-trigger]").forEach(el => {
    el.addEventListener("click", () => {
      const now = performance.now();
      if (now - devLastTapTime > 1500) {
        devTapCount = 0;
      }
      devTapCount += 1;
      devLastTapTime = now;
      if (devTapCount >= 7) {
        devTapCount = 0;
        activateDevMode();
      }
    });
  });

  if (ui["dev-hud-button"]) {
    ui["dev-hud-button"].addEventListener("click", () => {
      if (!ui["dev-panel"]) return;
      const isHidden = ui["dev-panel"].classList.toggle("is-hidden");
      if (!isHidden) {
        ui["dev-panel"].classList.remove("is-minimized");
        if (ui["dev-minimize-btn"]) ui["dev-minimize-btn"].textContent = "收合 ▲";
        renderDevPanel();
      }
    });
  }
  if (ui["dev-minimize-btn"]) {
    ui["dev-minimize-btn"].addEventListener("click", () => {
      if (!ui["dev-panel"]) return;
      const minimized = ui["dev-panel"].classList.toggle("is-minimized");
      ui["dev-minimize-btn"].textContent = minimized ? "展開 ▼" : "收合 ▲";
    });
  }
  if (ui["dev-sandbox-toggle"]) {
    ui["dev-sandbox-toggle"].addEventListener("click", () => {
      devSandbox = !devSandbox;
      if (!devSandbox && !spawnQueue.length && !monsters.length) {
        spawnQueue = createSpawnQueue();
      }
      renderDevPanel();
    });
  }
  if (ui["dev-clear-monsters"]) {
    ui["dev-clear-monsters"].addEventListener("click", () => {
      monsters = [];
      enemySpells = [];
      floatingTexts.push({
        x: WIDTH / 2,
        y: 320,
        text: "🧹 已清空場上所有怪物與法術",
        color: "#9ae6b4",
        life: 0.9,
        maxLife: 0.9
      });
    });
  }
  if (ui["dev-add-gold"]) {
    ui["dev-add-gold"].addEventListener("click", () => {
      gold += 10000;
      updateHUD();
      if (state === "shop") renderShop();
    });
  }
  if (ui["dev-exit-btn"]) {
    ui["dev-exit-btn"].addEventListener("click", deactivateDevMode);
  }
  if (ui["dev-panel"]) {
    ui["dev-panel"].querySelectorAll("[data-dev-tier]").forEach(btn => {
      btn.addEventListener("click", () => {
        devAllTier = Number(btn.dataset.devTier);
        weapons.forEach(w => { weaponTiers[w.id] = devAllTier; });
        updateHUD();
        renderDevPanel();
      });
    });
    ui["dev-panel"].querySelectorAll("[data-dev-count]").forEach(btn => {
      btn.addEventListener("click", () => {
        devSpawnCount = Number(btn.dataset.devCount);
        renderDevPanel();
      });
    });
  }

  ui["enter-select-button"].addEventListener("click", openWeaponSelection);
  ui["start-level-button"].addEventListener("click", startLevel);
  ui["finish-shop-button"].addEventListener("click", finishShop);
  ui["weapon-chip"].addEventListener("click", cycleWeapon);
  ui["pause-button"].addEventListener("click", () => togglePause());
  ui["resume-button"].addEventListener("click", () => togglePause(true));
  if (ui["hud-shop-button"]) {
    ui["hud-shop-button"].addEventListener("click", () => {
      if (state === "playing" || state === "paused") openShop("playing");
    });
  }
  if (ui["coin-pill"]) {
    ui["coin-pill"].addEventListener("click", () => {
      if (state === "playing" || state === "paused") openShop("playing");
    });
  }
  if (ui["select-shop-button"]) {
    ui["select-shop-button"].addEventListener("click", () => openShop("selecting"));
  }
  if (ui["result-shop-button"]) {
    ui["result-shop-button"].addEventListener("click", () => openShop("result"));
  }
  if (ui["pause-shop-button"]) {
    ui["pause-shop-button"].addEventListener("click", () => openShop("paused"));
  }
  if (ui["shop-tabs"]) {
    ui["shop-tabs"].querySelectorAll("[data-shop-page]").forEach(tab => {
      tab.addEventListener("click", () => {
        shopPage = Number(tab.dataset.shopPage);
        renderShop();
      });
    });
  }
  if (ui["shop-prev-page"]) {
    ui["shop-prev-page"].addEventListener("click", () => {
      if (shopPage > 0) {
        shopPage -= 1;
        renderShop();
      }
    });
  }
  if (ui["shop-next-page"]) {
    ui["shop-next-page"].addEventListener("click", () => {
      const totalPages = Math.ceil(weapons.length / SHOP_PAGE_SIZE);
      if (shopPage < totalPages - 1) {
        shopPage += 1;
        renderShop();
      }
    });
  }
  if (ui["owned-prev-page"]) {
    ui["owned-prev-page"].addEventListener("click", () => {
      if (ownedPage > 0) {
        ownedPage -= 1;
        renderOwnedWeapons();
      }
    });
  }
  if (ui["owned-next-page"]) {
    ui["owned-next-page"].addEventListener("click", () => {
      const totalPages = Math.ceil(owned.size / OWNED_PAGE_SIZE);
      if (ownedPage < totalPages - 1) {
        ownedPage += 1;
        renderOwnedWeapons();
      }
    });
  }
  ui["restart-button"].addEventListener("click", () => {
    startLevel();
  });
  ui["result-button"].addEventListener("click", () => {
    if (ui["result-button"].dataset.action === "new-game") newGame();
    else startLevel();
  });

  window.addEventListener("keydown", event => handleKey(event, true), { passive: false });
  window.addEventListener("keyup", event => handleKey(event, false), { passive: false });
  window.addEventListener("blur", () => {
    keys.clear();
    attackHeld = false;
    if (state === "playing") togglePause();
  });

  ui.joystick.addEventListener("pointerdown", event => {
    event.preventDefault();
    joystick.pointerId = event.pointerId;
    try { ui.joystick.setPointerCapture(event.pointerId); } catch {}
    updateJoystickFromPoint(event.clientX, event.clientY);
  }, { passive: false });
  window.addEventListener("pointermove", event => {
    if (joystick.pointerId !== null && event.pointerId === joystick.pointerId) {
      updateJoystickFromPoint(event.clientX, event.clientY);
    }
  }, { passive: false });
  window.addEventListener("pointerup", endJoystick);
  window.addEventListener("pointercancel", endJoystick);

  ui.joystick.addEventListener("touchstart", event => {
    if (window.PointerEvent) return;
    event.preventDefault();
    const touch = event.changedTouches[0];
    if (!touch) return;
    joystick.touchId = touch.identifier;
    updateJoystickFromPoint(touch.clientX, touch.clientY);
  }, { passive: false });
  ui.joystick.addEventListener("touchmove", event => {
    if (window.PointerEvent) return;
    event.preventDefault();
    for (const touch of event.changedTouches) {
      if (touch.identifier === joystick.touchId) {
        updateJoystickFromPoint(touch.clientX, touch.clientY);
        break;
      }
    }
  }, { passive: false });
  const endTouchJoystick = event => {
    if (window.PointerEvent) return;
    for (const touch of event.changedTouches) {
      if (touch.identifier === joystick.touchId) {
        endJoystick();
        break;
      }
    }
  };
  ui.joystick.addEventListener("touchend", endTouchJoystick);
  ui.joystick.addEventListener("touchcancel", endTouchJoystick);

  const attackButton = ui["attack-button"];
  let attackPointerId = null;
  const startTouchAttack = event => {
    event.preventDefault();
    if (event.pointerId !== undefined) {
      attackPointerId = event.pointerId;
      try { attackButton.setPointerCapture(event.pointerId); } catch {}
    }
    attackHeld = true;
    attackButton.classList.add("is-pressed");
    if (state === "playing" && attackClock <= 0) attack();
  };
  const stopTouchAttack = event => {
    if (event && event.pointerId !== undefined && attackPointerId !== null && event.pointerId !== attackPointerId) {
      return;
    }
    attackPointerId = null;
    attackHeld = false;
    attackButton.classList.remove("is-pressed");
  };
  attackButton.addEventListener("pointerdown", startTouchAttack, { passive: false });
  window.addEventListener("pointerup", stopTouchAttack);
  window.addEventListener("pointercancel", stopTouchAttack);
  attackButton.addEventListener("touchstart", event => {
    if (window.PointerEvent) return;
    startTouchAttack(event);
  }, { passive: false });
  attackButton.addEventListener("touchend", () => {
    if (window.PointerEvent) return;
    stopTouchAttack();
  });
  attackButton.addEventListener("touchcancel", () => {
    if (window.PointerEvent) return;
    stopTouchAttack();
  });

  window.gameDebug = {
    getState: () => ({
      state,
      level,
      gold,
      gateHp,
      defeated,
      resolvedCount,
      owned: [...owned],
      weaponTiers: { ...weaponTiers },
      selectedWeaponId,
      monsters: monsters.length,
      queued: spawnQueue.length
    }),
    setGold: amount => { gold = amount; updateHUD(); },
    jumpToLevel: targetLevel => {
      level = Math.max(1, Math.min(TOTAL_LEVELS, Number(targetLevel) || 1));
      openWeaponSelection();
    },
    winLevel: () => {
      monsters = [];
      spawnQueue = [];
      enemySpells = [];
    },
    loseLevel
  };

  loadImages().finally(() => {
    draw();
    requestAnimationFrame(frame);
  });
})();
