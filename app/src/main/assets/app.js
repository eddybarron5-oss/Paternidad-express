'use strict';

const $ = id => document.getElementById(id);
const photos = [null, null];

const questions = [
  ['¿La familia dice que parecen fotocopias?', ['¡Hasta los confunden!', 'Un poquito', 'Ni de chiste']],
  ['¿Qué tan parecida es su sonrisa?', ['La misma jeta', 'Algo similar', 'Nada que ver']],
  ['¿Ponen la misma cara cuando se enojan?', ['Idéntica', 'A veces', 'Para nada']],
  ['¿Se parecen en fotos de pequeños?', ['Muchísimo', 'Más o menos', 'No']],
  ['¿Comparten gestos o expresiones?', ['Todo el tiempo', 'Algunos', 'Ninguno']]
];

// Los 30 resultados oficiales del juego.
// Los porcentajes son ficticios, no pruebas de ADN.
const results = [
  {score:0, title:'¡ALERTA DE TOCAYOS!', line:'¡Ese no es tu hijo, es tu tocayo!', sameNameOnly:true},
  {score:0.1, title:'¡CHIVO EN LOS TAMALES!', line:'¡Aquí a alguien le andan haciendo de chivo los tamales!'},
  {score:0.2, title:'¡CÓDIGO ROJO!', line:'¡No manches! ¡La máquina pidió que revisaran hasta el acta de nacimiento!'},
  {score:0.3, title:'¡EXPEDIENTE SOSPECHOSO!', line:'¡Aquí hay más preguntas que respuestas y el Doctor ADN ya quiere vacaciones!'},
  {score:0.4, title:'¡SE ARMÓ LA NOVELA!', line:'¡Esto ya parece capítulo final de telenovela, pero sin comerciales!'},
  {score:0.5, title:'¡EL VECINO EN LA MIRA!', line:'¡Aquí alguien se parece más al vecino que a quien le encasquetaron el hijo!'},
  {score:0.6, title:'¡NO CUADRA!', line:'¡La máquina buscó parecido hasta debajo de las piedras y regresó con las manos vacías!'},
  {score:0.7, title:'¡ERROR DE FÁBRICA!', line:'¡Ni reiniciando al Doctor ADN encontramos semejanza, compadre!'},
  {score:0.8, title:'¡ALERTA DE CHISME!', line:'¡Que alguien llame a la comadre, porque este resultado viene con novela incluida!'},
  {score:0.9, title:'¡ESCÁNDALO NACIONAL!', line:'¡Hasta el escáner se persignó cuando vio estas dos fotografías!'},
  {score:1, title:'¡NO SE PARECEN NI EN EL SUSTO!', line:'¡La única coincidencia es que los dos salieron en la misma prueba!'},
  {score:2, title:'¡EL DOCTOR RENUNCIA!', line:'¡Después de analizar esas fotos, el Doctor ADN pidió su liquidación!'},
  {score:3, title:'¡PARECIDO EXTRAVIADO!', line:'¡Si encuentran el parecido, favor de entregarlo en objetos perdidos!'},
  {score:4, title:'¡SE BUSCA COINCIDENCIA!', line:'¡Ofrecemos recompensa a quien encuentre un rasgo parecido!'},
  {score:5, title:'¡EL ÁRBOL GENEALÓGICO TEMBLÓ!', line:'¡El árbol familiar pidió que no lo metieran en este problema!'},
  {score:7, title:'¡EL ESCÁNER TIENE DUDAS!', line:'¡Aquí se necesita otra foto, otra opinión y hasta otro doctor!'},
  {score:9, title:'¡MISTERIO SIN RESOLVER!', line:'¡Tenemos un parecido tan escondido que ni con lupa lo encontramos!'},
  {score:12, title:'¡EL PADRINO BAJO INVESTIGACIÓN!', line:'Bueno, al menos no se parece a un desconocido. ¡Tiene rasgos del padrino! Sube las fotos del padrino.'},
  {score:15, title:'¡ALGO HAY!', line:'¡Una coincidencia encontramos! Ahora nomás faltan las otras noventa y nueve.'},
  {score:19, title:'¡LA FAMILIA OPINA!', line:'¡La tía dice que sí se parecen, pero la tía también cree todo lo que ve en Facebook!'},
  {score:25, title:'¡EL DOCTOR SE CONFUNDIÓ!', line:'¡Por un momento creímos encontrar parecido, pero se nos pasó el susto!'},
  {score:35, title:'¡SOSPECHOSAMENTE FAMILIARES!', line:'¡Se parecen lo suficiente para salir juntos en la foto familiar!'},
  {score:45, title:'¡EL MISTERIO CRECE!', line:'¡Aquí hay una coincidencia interesante, pero el Doctor ADN no se quiere comprometer!'},
  {score:55, title:'¡MITAD Y MITAD!', line:'¡La máquina dice que sí, luego que no, y ahora pide vacaciones!'},
  {score:68, title:'¡PARECIDO EN INVESTIGACIÓN!', line:'¡Aquí ya hay material para que la familia empiece a discutir en Navidad!'},
  {score:79, title:'¡CASI FOTOCOPIAS!', line:'¡No son idénticos, pero el escáner ya está sudando de los nervios!'},
  {score:90, title:'¡PREMIO DEL LABORATORIO!', line:'¡A la madre! ¡Por fin encontramos dos caras que parecen de la misma fábrica!'},
  {score:95, title:'¡FOTOCOPIA HUMANA!', line:'¡Hasta las expresiones les salieron parecidas! ¡Esto merece una segunda foto!'},
  {score:98, title:'¡MILAGRO GENÉTICO!', line:'¡MILAGRO! ¡Tenemos un parecido extraordinario! ¡Se parecen mucho las orejas y la nariz!'},
  {score:99.9, title:'¡EL DOCTOR ADN NO LO CREE!', line:'¡No manches! ¡Parecen la misma persona en diferentes temporadas de la vida!'}
];

function speech(text) {
  $('speech').textContent = text;
  if ($('voice').checked && window.DoctorAndroid) {
    window.DoctorAndroid.speak(text);
  }
}

$('voice').addEventListener('change', event => {
  if (!event.target.checked && window.DoctorAndroid) {
    window.DoctorAndroid.stop();
  }
  if (event.target.checked) {
    speech('¡Se activó la voz del Doctor ADN! ¡A ver esas jetas!');
  }
});

function show(id) {
  for (const section of ['start', 'quiz', 'loading', 'result']) {
    $(section).classList.toggle('hidden', section !== id);
  }
  window.scrollTo(0, 0);
}

function pick(items) {
  return items[Math.floor(Math.random() * items.length)];
}

function normalizeName(name) {
  return name.trim()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/\s+/g, ' ');
}

// Leer y reducir fotografías para Android WebView.
function loadImage(file) {
  return new Promise((resolve, reject) => {
    if (!file || !file.type.startsWith('image/')) {
      reject(new Error('Archivo no válido'));
      return;
    }

    const reader = new FileReader();

    reader.onerror = () => reject(new Error('No se pudo leer la fotografía'));

    reader.onload = () => {
      const img = new Image();

      img.onerror = () => reject(new Error('Formato de imagen no compatible'));

      img.onload = () => {
        try {
          const canvas = document.createElement('canvas');
          const maxSize = 1100;
          const scale = Math.min(
            1,
            maxSize / Math.max(img.naturalWidth, img.naturalHeight)
          );

          canvas.width = Math.max(1, Math.round(img.naturalWidth * scale));
          canvas.height = Math.max(1, Math.round(img.naturalHeight * scale));

          const ctx = canvas.getContext('2d');
          ctx.fillStyle = '#10172d';
          ctx.fillRect(0, 0, canvas.width, canvas.height);
          ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

          resolve(canvas.toDataURL('image/jpeg', 0.85));
        } catch (error) {
          reject(error);
        }
      };

      img.src = reader.result;
    };

    reader.readAsDataURL(file);
  });
}

// Mostrar fotos inmediatamente en sus cuadros.
for (const [index, inputId, previewId] of [
  [0, 'father', 'p1'],
  [1, 'child', 'p2']
]) {
  $(inputId).addEventListener('change', async event => {
    const file = event.target.files && event.target.files[0];
    if (!file) return;

    try {
      $(previewId).textContent = '⏳';
      const data = await loadImage(file);

      photos[index] = data;

      const preview = document.createElement('img');
      preview.src = data;
      preview.alt = 'Fotografía seleccionada';

      $(previewId).replaceChildren(preview);

      speech(index === 0
        ? '¡Primera fotografía registrada!'
        : '¡Ya tenemos las dos fotografías! ¡Esto se va a poner bueno!');
    } catch (error) {
      photos[index] = null;
      $(previewId).textContent = '📷';
      alert('No pude abrir esa foto. Prueba con JPG o PNG.');
    }
  });
}

// Construir las preguntas.
$('go').onclick = () => {
  if (!photos[0] || !photos[1]) {
    alert('¡Primero sube las dos fotografías!');
    return;
  }

  if (!$('consent').checked) {
    alert('Confirma que tienes autorización para usar las fotografías.');
    return;
  }

  $('questions').replaceChildren();

  questions.forEach(([question, options], index) => {
    const wrap = document.createElement('div');
    wrap.className = 'question';

    const heading = document.createElement('b');
    heading.textContent = `${index + 1}. ${question}`;
    wrap.append(heading);

    options.forEach((option, optionIndex) => {
      const label = document.createElement('label');
      const radio = document.createElement('input');

      radio.type = 'radio';
      radio.name = 'q' + index;
      radio.value = String(optionIndex);

      label.append(radio, document.createTextNode(option));
      wrap.append(label);
    });

    $('questions').append(wrap);
  });

  speech('¡Empieza el interrogatorio! ¡Aquí nadie sale sin contestar!');
  show('quiz');
};

// Elegir un resultado ficticio.
// 75% bajo, 15% intermedio, 8% moderado y 2% premio.
function generateResult(sameName) {
  const random = Math.random() * 100;
  let pool;

  if (random < 75) {
    pool = results.filter(item =>
      item.score < 1 && (!item.sameNameOnly || sameName)
    );
  } else if (random < 90) {
    pool = results.filter(item => item.score >= 1 && item.score <= 25);
  } else if (random < 98) {
    pool = results.filter(item => item.score >= 35 && item.score <= 79);
  } else {
    pool = results.filter(item => item.score >= 90);
  }

  return pick(pool);
}

// Ejecutar el escaneo visual.
$('analyze').onclick = () => {
  const answers = questions.map((_, index) => {
    const selected = document.querySelector(
      'input[name="q' + index + '"]:checked'
    );
    return selected ? selected.value : undefined;
  });

  if (answers.some(answer => answer === undefined)) {
    alert('¡Contesta todas las preguntas, compadre!');
    return;
  }

  if (!photos[0] || !photos[1]) {
    alert('Faltan fotografías. Inicia una nueva investigación.');
    return;
  }

  const name1 = normalizeName($('n1').value);
  const name2 = normalizeName($('n2').value);
  const sameName = Boolean(name1 && name2 && name1 === name2);

  const result = generateResult(sameName);

  $('scan1').src = photos[0];
  $('scan2').src = photos[1];

  // Reiniciar la animación cada vez que se ejecuta.
  const stage = document.querySelector('.scan-stage');
  const replacement = stage.cloneNode(true);
  stage.replaceWith(replacement);

  show('loading');
  speech('¡Silencio en el laboratorio! ¡Escaneando rostros de mentiritas! ¡Se viene la bomba!');

  setTimeout(() => {
    $('score').textContent = result.score + '%';
    $('alert').textContent = result.title;
    $('headline').textContent = result.line;

    const positive = answers.filter(answer => answer === '0').length;

    $('verdict').textContent =
      'Interrogatorio: ' + positive +
      ' de 5 respuestas de gran parecido. ' +
      'Este porcentaje es ficticio y forma parte del juego.';

    $('tocayo').textContent = '';

    show('result');
    speech(result.line);
  }, 4000);
};

// Nueva investigación.
$('again').onclick = () => {
  for (const id of ['father', 'child']) {
    $(id).value = '';
  }

  for (const id of ['p1', 'p2']) {
    $(id).textContent = '📷';
  }

  for (const id of ['n1', 'n2']) {
    $(id).value = '';
  }

  $('consent').checked = false;
  photos.fill(null);

  $('scan1').removeAttribute('src');
  $('scan2').removeAttribute('src');

  speech('¡Siguiente expediente, compadre!');
  show('start');
};

// Compartir el resultado.
$('share').onclick = async () => {
  const message =
    '🧬 PRUEBA DE PATERNIDAD EXPRESS\n' +
    $('score').textContent + ' — Resultado ficticio\n' +
    $('headline').textContent +
    '\n⚠️ Juego de entretenimiento. No determina parentesco.';

  if (window.DoctorAndroid) {
    window.DoctorAndroid.share(message);
    return;
  }

  if (navigator.share) {
    try {
      await navigator.share({text:message});
      return;
    } catch (error) {}
  }

  try {
    await navigator.clipboard.writeText(message);
    alert('¡Resultado copiado!');
  } catch (error) {
    prompt('Copia tu resultado:', message);
  }
};
