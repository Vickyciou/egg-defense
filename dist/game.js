(() => {
  "use strict";

  const WIDTH = 1600;
  const HEIGHT = 900;
  const PLAY_BOUNDS = { left: 235, right: 1380, top: 295, bottom: 790 };
  const GATE = { x: 205, y: 665 };

  const weapons = [
    { id: 0, name: "拳頭", price: 0, damage: 7, cooldown: 0.5, melee: true, range: 170, icon: null },
    { id: 1, name: "鐮刀", price: 50, damage: 8, cooldown: 0.5, melee: true, range: 220, icon: "assets/weapons/01-scythe.png" },
    { id: 2, name: "長刀", price: 100, damage: 9, cooldown: 0.5, melee: true, range: 245, icon: "assets/weapons/02-longsword.png" },
    { id: 3, name: "弓", price: 250, damage: 8, cooldown: 0.5, melee: false, icon: "assets/weapons/03-bow.png" },
    { id: 4, name: "M1911", price: 550, damage: 10, cooldown: 0.5, melee: false, icon: "assets/weapons/04-m1911.png" },
    { id: 5, name: "GL06", price: 900, damage: 20, cooldown: 1.5, melee: false, icon: "assets/weapons/05-gl06.png" },
    { id: 6, name: "AK-47", price: 1500, damage: 15, cooldown: 0.5, melee: false, icon: "assets/weapons/06-ak47.png" },
    { id: 7, name: "M134", price: 2000, damage: 25, cooldown: 0.5, melee: false, icon: "assets/weapons/07-m134.png" }
  ];

  const monsterTypes = {
    zombie: { name: "方塊殭屍", hp: 20, reward: 10, image: "assets/monsters/zombie_monster.png", width: 154, height: 116 },
    knight: { name: "三刺皇冠小戰士", hp: 60, reward: 50, image: "assets/monsters/knight_monster.png", width: 170, height: 128 }
  };

  const levels = {
    1: { spawnInterval: 2.5, zombies: 20, knights: 0 },
    2: { spawnInterval: 2.0, zombies: 20, knights: 5 }
  };

  const canvas = document.querySelector("#game-canvas");
  const ctx = canvas.getContext("2d");
  const ui = Object.fromEntries([
    "hud", "kill-count", "gold-count", "stage-label", "weapon-thumb", "weapon-label",
    "start-screen", "weapon-screen", "owned-weapons", "start-level-button", "selection-kicker", "selection-copy",
    "shop-screen", "shop-list", "shop-gold", "finish-shop-button", "result-screen", "result-badge",
    "result-kicker", "result-title", "result-copy", "result-stats", "result-button", "pause-screen",
    "pause-button", "resume-button", "restart-button", "enter-select-button", "joystick", "joystick-knob", "attack-button"
  ].map(id => [id, document.getElementById(id)]));

  const images = {};
  const assetPaths = {
    background: "assets/scenes/battlefield_background.jpeg",
    player: "assets/character/main.png",
    zombie: monsterTypes.zombie.image,
    knight: monsterTypes.knight.image
  };
  weapons.filter(w => w.icon).forEach(w => { assetPaths[`weapon-${w.id}`] = w.icon; });

  let state = "intro";
  let level = 1;
  let gold = 0;
  let checkpoint = null;
  let owned = new Set([0]);
  let selectedWeaponId = 0;
  let monsters = [];
  let spawnQueue = [];
  let spawnClock = 0;
  let defeated = 0;
  let levelEarned = 0;
  let lastTime = performance.now();
  let attackHeld = false;
  let attackClock = 0;
  let attackFlash = 0;
  let hitBursts = [];
  let projectiles = [];
  let shake = 0;
  let elapsed = 0;
  const keys = new Set();
  const player = { x: 425, y: 615, width: 88, height: 112, speed: 305 };
  const joystick = { pointerId: null, x: 0, y: 0 };

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

  function setScreen(id) {
    ["start-screen", "weapon-screen", "shop-screen", "result-screen", "pause-screen"].forEach(screen => {
      ui[screen].classList.toggle("is-hidden", screen !== id);
    });
  }

  function showControls(show) {
    ui.hud.classList.toggle("is-hidden", !show);
    ui.joystick.classList.toggle("is-hidden", !show);
    ui["attack-button"].classList.toggle("is-hidden", !show);
  }

  function updateHUD() {
    const total = levels[level].zombies + levels[level].knights;
    ui["kill-count"].textContent = `${defeated} / ${total}`;
    ui["gold-count"].textContent = gold;
    ui["stage-label"].textContent = `第 ${level} 關`;
    const weapon = weapons[selectedWeaponId];
    ui["weapon-label"].textContent = weapon.name;
    ui["weapon-thumb"].innerHTML = weapon.icon ? `<img src="${weapon.icon}" alt="" />` : "<span>✊</span>";
  }

  function weaponMarkup(weapon, selectable = true) {
    const art = weapon.icon ? `<img src="${weapon.icon}" alt="${weapon.name}" />` : '<div class="fist-art">✊</div>';
    return `<button class="weapon-option${selectedWeaponId === weapon.id ? " selected" : ""}" type="button" data-weapon="${weapon.id}" ${selectable ? "" : "disabled"}>
      ${art}<strong>${weapon.name}</strong><small>攻擊力 ${weapon.damage}</small>
    </button>`;
  }

  function openWeaponSelection() {
    state = "selecting";
    showControls(false);
    setScreen("weapon-screen");
    ui["selection-kicker"].textContent = level === 1 ? "首次出戰" : "第二關準備";
    ui["selection-copy"].textContent = level === 1 ? "第一關只能使用拳頭，靠近怪物再出拳。" : "選擇一把已擁有的武器。進入戰場後不能切換。";
    ui["start-level-button"].innerHTML = `開始第 ${level} 關 <span>→</span>`;
    renderOwnedWeapons();
  }

  function renderOwnedWeapons() {
    const available = level === 1 ? [weapons[0]] : weapons.filter(w => owned.has(w.id));
    if (!available.some(w => w.id === selectedWeaponId)) selectedWeaponId = available[0].id;
    ui["owned-weapons"].innerHTML = available.map(w => weaponMarkup(w)).join("");
    ui["owned-weapons"].querySelectorAll("[data-weapon]").forEach(button => {
      button.addEventListener("click", () => {
        selectedWeaponId = Number(button.dataset.weapon);
        renderOwnedWeapons();
      });
    });
  }

  function createSpawnQueue() {
    const config = levels[level];
    const queue = [
      ...Array(config.zombies).fill("zombie"),
      ...Array(config.knights).fill("knight")
    ];
    return shuffle(queue);
  }

  function startLevel() {
    state = "playing";
    monsters = [];
    spawnQueue = createSpawnQueue();
    spawnClock = 0.42;
    defeated = 0;
    levelEarned = 0;
    attackClock = 0;
    attackHeld = false;
    hitBursts = [];
    projectiles = [];
    player.x = 425;
    player.y = 615;
    checkpoint = { gold, owned: new Set(owned), selectedWeaponId };
    setScreen(null);
    showControls(true);
    updateHUD();
  }

  function spawnMonster(typeKey) {
    const type = monsterTypes[typeKey];
    const y = 330 + Math.random() * 420;
    const x = 1510 + Math.random() * 45;
    const dx = GATE.x - x;
    const dy = GATE.y - y;
    const distance = Math.hypot(dx, dy);
    const speed = distance / 13;
    monsters.push({
      id: crypto.randomUUID ? crypto.randomUUID() : `${Date.now()}-${Math.random()}`,
      typeKey,
      x, y,
      vx: dx / distance * speed,
      vy: dy / distance * speed,
      hp: type.hp,
      maxHp: type.hp,
      reward: type.reward,
      hurt: 0,
      dead: false
    });
  }

  function attack() {
    const weapon = weapons[selectedWeaponId];
    attackFlash = 0.16;
    attackClock = weapon.cooldown;
    const hits = [];

    if (weapon.melee) {
      monsters.forEach(monster => {
        const dx = monster.x - player.x;
        const dy = Math.abs(monster.y - player.y);
        if (!monster.dead && dx >= 12 && dx <= weapon.range && dy <= 105) hits.push(monster);
      });
    } else {
      monsters.forEach(monster => {
        const dx = monster.x - player.x;
        const laneWidth = monster.typeKey === "knight" ? 66 : 58;
        if (!monster.dead && dx > 30 && Math.abs(monster.y - player.y) <= laneWidth) hits.push(monster);
      });
      projectiles.push({ x: player.x + 50, y: player.y - 15, life: 0.18, weaponId: weapon.id });
    }

    hits.forEach(monster => damageMonster(monster, weapon.damage));
  }

  function damageMonster(monster, amount) {
    monster.hp -= amount;
    monster.hurt = 0.13;
    hitBursts.push({ x: monster.x, y: monster.y - 20, life: .28, maxLife: .28 });
    if (monster.hp <= 0 && !monster.dead) {
      monster.dead = true;
      defeated += 1;
      gold += monster.reward;
      levelEarned += monster.reward;
      shake = .13;
      updateHUD();
    }
  }

  function update(dt) {
    elapsed += dt;
    attackFlash = Math.max(0, attackFlash - dt);
    attackClock = Math.max(0, attackClock - dt);
    shake = Math.max(0, shake - dt);
    hitBursts.forEach(burst => { burst.life -= dt; });
    hitBursts = hitBursts.filter(burst => burst.life > 0);
    projectiles.forEach(shot => { shot.life -= dt; shot.x += dt * 1600; });
    projectiles = projectiles.filter(shot => shot.life > 0);

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
    player.x = Math.max(PLAY_BOUNDS.left, Math.min(PLAY_BOUNDS.right, player.x + dx * player.speed * dt));
    player.y = Math.max(PLAY_BOUNDS.top, Math.min(PLAY_BOUNDS.bottom, player.y + dy * player.speed * dt));

    if (attackHeld && attackClock <= 0) attack();

    spawnClock -= dt;
    if (spawnQueue.length && spawnClock <= 0) {
      spawnMonster(spawnQueue.shift());
      spawnClock += levels[level].spawnInterval;
    }

    for (const monster of monsters) {
      if (monster.dead) continue;
      monster.x += monster.vx * dt;
      monster.y += monster.vy * dt;
      monster.hurt = Math.max(0, monster.hurt - dt);
      if (monster.x <= GATE.x + 15) {
        loseLevel();
        return;
      }
    }
    monsters = monsters.filter(monster => !monster.dead);

    if (!spawnQueue.length && !monsters.length) winLevel();
  }

  function loseLevel() {
    state = "result";
    attackHeld = false;
    gold = checkpoint.gold;
    owned = new Set(checkpoint.owned);
    selectedWeaponId = checkpoint.selectedWeaponId;
    showControls(false);
    ui["result-badge"].textContent = "!";
    ui["result-badge"].style.background = "var(--yellow)";
    ui["result-kicker"].textContent = "城門失守";
    ui["result-title"].textContent = "差一點就守住了";
    ui["result-copy"].textContent = "本次獲得的金幣不會結算，再試一次吧！";
    ui["result-stats"].innerHTML = `<div><strong>${defeated}</strong><span>擊退怪物</span></div><div><strong>$${levelEarned}</strong><span>本次未結算</span></div>`;
    ui["result-button"].innerHTML = '重新挑戰 <span>↻</span>';
    ui["result-button"].dataset.action = "retry";
    setScreen("result-screen");
    updateHUD();
  }

  function winLevel() {
    attackHeld = false;
    showControls(false);
    if (level === 1) {
      state = "shop";
      openShop();
      return;
    }
    state = "complete";
    ui["result-badge"].textContent = "✓";
    ui["result-badge"].style.background = "#bce88f";
    ui["result-kicker"].textContent = "兩關全數守住";
    ui["result-title"].textContent = "第一版完成！";
    ui["result-copy"].textContent = "你成功守住城門，也完成了這次守城 Demo。";
    ui["result-stats"].innerHTML = `<div><strong>${defeated}</strong><span>第二關擊退</span></div><div><strong>$${gold}</strong><span>最終金幣</span></div><div><strong>${owned.size}</strong><span>擁有武器</span></div>`;
    ui["result-button"].innerHTML = '再玩一次 <span>↻</span>';
    ui["result-button"].dataset.action = "new-game";
    setScreen("result-screen");
  }

  function openShop() {
    setScreen("shop-screen");
    renderShop();
  }

  function renderShop() {
    ui["shop-gold"].textContent = gold;
    ui["shop-list"].innerHTML = weapons.slice(1).map(weapon => {
      const isOwned = owned.has(weapon.id);
      const canBuy = gold >= weapon.price && !isOwned;
      return `<article class="shop-item${isOwned ? " is-owned" : ""}">
        <img src="${weapon.icon}" alt="${weapon.name}" />
        <div><h3>${weapon.name}</h3><p>攻擊力 ${weapon.damage} · ${weapon.melee ? "近戰群攻" : "直線穿透"}</p>
        <button class="buy-button" type="button" data-buy="${weapon.id}" ${canBuy ? "" : "disabled"}>${isOwned ? "已擁有" : `$ ${weapon.price}`}</button></div>
      </article>`;
    }).join("");
    ui["shop-list"].querySelectorAll("[data-buy]").forEach(button => {
      button.addEventListener("click", () => buyWeapon(Number(button.dataset.buy)));
    });
  }

  function buyWeapon(id) {
    const weapon = weapons[id];
    if (owned.has(id) || gold < weapon.price) return;
    gold -= weapon.price;
    owned.add(id);
    renderShop();
    updateHUD();
  }

  function finishShop() {
    level = 2;
    selectedWeaponId = owned.has(3) ? 3 : [...owned].at(-1) || 0;
    openWeaponSelection();
  }

  function newGame() {
    level = 1;
    gold = 0;
    owned = new Set([0]);
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
    const shakeX = shake > 0 ? (Math.random() - .5) * 8 : 0;
    const shakeY = shake > 0 ? (Math.random() - .5) * 6 : 0;
    ctx.translate(shakeX, shakeY);
    drawImageCover(images.background);

    ctx.fillStyle = "rgba(15,48,24,.09)";
    ctx.beginPath();
    ctx.ellipse(player.x, player.y + 46, 46, 14, 0, 0, Math.PI * 2);
    ctx.fill();

    const drawables = [
      ...monsters.map(monster => ({ type: "monster", y: monster.y, data: monster })),
      { type: "player", y: player.y, data: player }
    ].sort((a, b) => a.y - b.y);

    drawables.forEach(item => item.type === "player" ? drawPlayer() : drawMonster(item.data));
    drawAttacks();
    drawBursts();
    drawGateWarning();
    ctx.restore();
  }

  function drawPlayer() {
    const bob = state === "playing" ? Math.sin(elapsed * 7) * 2 : 0;
    if (images.player) ctx.drawImage(images.player, player.x - player.width / 2, player.y - player.height + bob, player.width, player.height);
    const weapon = weapons[selectedWeaponId];
    if (weapon.icon && images[`weapon-${weapon.id}`]) {
      ctx.save();
      ctx.translate(player.x + 40, player.y - 55 + bob);
      ctx.rotate(-.08);
      ctx.drawImage(images[`weapon-${weapon.id}`], -5, -22, 76, 48);
      ctx.restore();
    }
  }

  function drawMonster(monster) {
    const type = monsterTypes[monster.typeKey];
    const image = images[monster.typeKey];
    const bob = Math.sin(elapsed * 7 + monster.x * .03) * 2;
    ctx.save();
    if (monster.hurt > 0) { ctx.globalAlpha = .58; ctx.filter = "brightness(1.8) saturate(.3)"; }
    if (image) ctx.drawImage(image, monster.x - type.width / 2, monster.y - type.height + bob, type.width, type.height);
    ctx.restore();

    const barWidth = type.width * .86;
    const barX = monster.x - barWidth / 2;
    const barY = monster.y - type.height - 18;
    ctx.fillStyle = "#17241f";
    roundRect(barX - 3, barY - 3, barWidth + 6, 13, 6);
    ctx.fill();
    ctx.fillStyle = "#f5eeda";
    roundRect(barX, barY, barWidth, 7, 4);
    ctx.fill();
    ctx.fillStyle = monster.hp / monster.maxHp < .35 ? "#f04e3c" : "#4cab55";
    roundRect(barX, barY, barWidth * Math.max(0, monster.hp / monster.maxHp), 7, 4);
    ctx.fill();
  }

  function drawAttacks() {
    if (attackFlash > 0 && weapons[selectedWeaponId].melee) {
      ctx.save();
      ctx.globalAlpha = attackFlash / .16;
      ctx.strokeStyle = selectedWeaponId === 0 ? "#fff4c6" : "#ffd64b";
      ctx.lineWidth = 22;
      ctx.lineCap = "round";
      ctx.beginPath();
      ctx.arc(player.x + 35, player.y - 43, weapons[selectedWeaponId].range * .64, -1.05, .72);
      ctx.stroke();
      ctx.strokeStyle = "rgba(255,113,61,.85)";
      ctx.lineWidth = 6;
      ctx.stroke();
      ctx.restore();
    }
    projectiles.forEach(shot => {
      const alpha = shot.life / .18;
      ctx.save();
      ctx.globalAlpha = alpha;
      ctx.strokeStyle = shot.weaponId === 3 ? "#f6e8b0" : shot.weaponId === 5 ? "#ff9c38" : "#fff8d9";
      ctx.lineWidth = shot.weaponId === 5 ? 14 : 6;
      ctx.lineCap = "round";
      ctx.beginPath();
      ctx.moveTo(shot.x, shot.y);
      ctx.lineTo(WIDTH - 95, shot.y);
      ctx.stroke();
      ctx.restore();
    });
  }

  function drawBursts() {
    hitBursts.forEach(burst => {
      const progress = 1 - burst.life / burst.maxLife;
      ctx.save();
      ctx.globalAlpha = 1 - progress;
      ctx.strokeStyle = "#fff7bf";
      ctx.lineWidth = 7;
      for (let i = 0; i < 6; i += 1) {
        const angle = i * Math.PI / 3;
        const inner = 18 + progress * 16;
        const outer = 35 + progress * 31;
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
    if (closest > 470) return;
    const alpha = .35 + Math.sin(elapsed * 9) * .18;
    ctx.save();
    ctx.globalAlpha = alpha;
    ctx.strokeStyle = "#ff4f35";
    ctx.lineWidth = 10;
    ctx.beginPath();
    ctx.arc(GATE.x, GATE.y - 10, 80, -1.2, 1.2);
    ctx.stroke();
    ctx.restore();
  }

  function roundRect(x, y, w, h, radius) {
    if (w <= 0) return;
    ctx.beginPath();
    ctx.roundRect(x, y, w, h, Math.min(radius, w / 2, h / 2));
  }

  function frame(now) {
    const dt = Math.min(.04, (now - lastTime) / 1000);
    lastTime = now;
    update(dt);
    draw();
    requestAnimationFrame(frame);
  }

  function handleKey(event, down) {
    if (["ArrowLeft", "ArrowRight", "ArrowUp", "ArrowDown", "Space"].includes(event.code)) event.preventDefault();
    if (event.code === "Escape" && down && !event.repeat && (state === "playing" || state === "paused")) togglePause();
    if (event.code === "Space") attackHeld = down;
    if (down) keys.add(event.code); else keys.delete(event.code);
  }

  function updateJoystick(event) {
    const rect = ui.joystick.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    let dx = event.clientX - centerX;
    let dy = event.clientY - centerY;
    const max = rect.width * .28;
    const length = Math.hypot(dx, dy);
    if (length > max) { dx = dx / length * max; dy = dy / length * max; }
    joystick.x = dx / max;
    joystick.y = dy / max;
    ui["joystick-knob"].style.transform = `translate(${dx}px, ${dy}px)`;
  }

  function endJoystick(event) {
    if (event.pointerId !== joystick.pointerId) return;
    joystick.pointerId = null;
    joystick.x = 0;
    joystick.y = 0;
    ui["joystick-knob"].style.transform = "translate(0,0)";
  }

  ui["enter-select-button"].addEventListener("click", openWeaponSelection);
  ui["start-level-button"].addEventListener("click", startLevel);
  ui["finish-shop-button"].addEventListener("click", finishShop);
  ui["pause-button"].addEventListener("click", () => togglePause());
  ui["resume-button"].addEventListener("click", () => togglePause(true));
  ui["restart-button"].addEventListener("click", () => {
    gold = checkpoint.gold;
    owned = new Set(checkpoint.owned);
    selectedWeaponId = checkpoint.selectedWeaponId;
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
    if (joystick.pointerId !== null) return;
    joystick.pointerId = event.pointerId;
    ui.joystick.setPointerCapture(event.pointerId);
    updateJoystick(event);
  });
  ui.joystick.addEventListener("pointermove", event => {
    if (event.pointerId === joystick.pointerId) updateJoystick(event);
  });
  ui.joystick.addEventListener("pointerup", endJoystick);
  ui.joystick.addEventListener("pointercancel", endJoystick);

  const attackButton = ui["attack-button"];
  attackButton.addEventListener("pointerdown", event => {
    attackButton.setPointerCapture(event.pointerId);
    attackHeld = true;
    attackButton.classList.add("is-pressed");
  });
  const stopTouchAttack = () => { attackHeld = false; attackButton.classList.remove("is-pressed"); };
  attackButton.addEventListener("pointerup", stopTouchAttack);
  attackButton.addEventListener("pointercancel", stopTouchAttack);

  window.gameDebug = {
    getState: () => ({ state, level, gold, defeated, owned: [...owned], selectedWeaponId, monsters: monsters.length, queued: spawnQueue.length }),
    winLevel: () => { monsters = []; spawnQueue = []; },
    loseLevel
  };

  loadImages().finally(() => {
    draw();
    requestAnimationFrame(frame);
  });
})();
