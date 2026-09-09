/* Datos de los 66 libros, categorías y utilidades de búsqueda de citas. */

const BOOKS = [
 {o:1,n:"Génesis",cat:"pentateuco",a:"Moisés",t:"Orígenes: creación, caída y pacto con Abraham"},
 {o:2,n:"Éxodo",cat:"pentateuco",a:"Moisés",t:"Liberación de Egipto y entrega de la Ley"},
 {o:3,n:"Levítico",cat:"pentateuco",a:"Moisés",t:"Leyes de santidad y sacerdocio"},
 {o:4,n:"Números",cat:"pentateuco",a:"Moisés",t:"El peregrinar de Israel por el desierto"},
 {o:5,n:"Deuteronomio",cat:"pentateuco",a:"Moisés",t:"Renovación del pacto antes de entrar a Canaán"},
 {o:6,n:"Josué",cat:"historicos",a:"Josué (trad.)",t:"Conquista de la tierra prometida"},
 {o:7,n:"Jueces",cat:"historicos",a:"Samuel (trad.)",t:"Ciclos de pecado, opresión y liberación"},
 {o:8,n:"Rut",cat:"historicos",a:"Samuel (trad.)",t:"Fidelidad y redención en tiempos de los jueces"},
 {o:9,n:"1 Samuel",cat:"historicos",a:"Samuel/Natán/Gad",t:"Samuel, Saúl y el ascenso de David"},
 {o:10,n:"2 Samuel",cat:"historicos",a:"Natán/Gad",t:"El reinado de David"},
 {o:11,n:"1 Reyes",cat:"historicos",a:"Jeremías (trad.)",t:"Salomón y la división del reino"},
 {o:12,n:"2 Reyes",cat:"historicos",a:"Jeremías (trad.)",t:"Caída de Israel y Judá"},
 {o:13,n:"1 Crónicas",cat:"historicos",a:"Esdras (trad.)",t:"Genealogías y reinado de David"},
 {o:14,n:"2 Crónicas",cat:"historicos",a:"Esdras (trad.)",t:"Reyes de Judá hasta el exilio"},
 {o:15,n:"Esdras",cat:"historicos",a:"Esdras",t:"Retorno del exilio y reconstrucción del templo"},
 {o:16,n:"Nehemías",cat:"historicos",a:"Nehemías",t:"Reconstrucción de los muros de Jerusalén"},
 {o:17,n:"Ester",cat:"historicos",a:"Desconocido",t:"La providencia de Dios en el exilio"},
 {o:18,n:"Job",cat:"poeticos",a:"Desconocido",t:"El sufrimiento y la soberanía de Dios"},
 {o:19,n:"Salmos",cat:"poeticos",a:"David y otros",t:"Poesía y adoración a Dios"},
 {o:20,n:"Proverbios",cat:"poeticos",a:"Salomón",t:"Sabiduría práctica para la vida"},
 {o:21,n:"Eclesiastés",cat:"poeticos",a:"Salomón (trad.)",t:"El sentido de la vida bajo el sol"},
 {o:22,n:"Cantares",cat:"poeticos",a:"Salomón (trad.)",t:"El amor conyugal"},
 {o:23,n:"Isaías",cat:"profmay",a:"Isaías",t:"El Mesías prometido"},
 {o:24,n:"Jeremías",cat:"profmay",a:"Jeremías",t:"Juicio sobre Judá y anuncio de un nuevo pacto"},
 {o:25,n:"Lamentaciones",cat:"profmay",a:"Jeremías",t:"Lamento por la caída de Jerusalén"},
 {o:26,n:"Ezequiel",cat:"profmay",a:"Ezequiel",t:"Juicio y restauración de Israel"},
 {o:27,n:"Daniel",cat:"profmay",a:"Daniel",t:"La soberanía de Dios sobre las naciones"},
 {o:28,n:"Oseas",cat:"profmen",a:"Oseas",t:"El amor fiel de Dios pese a la infidelidad"},
 {o:29,n:"Joel",cat:"profmen",a:"Joel",t:"El día del Señor"},
 {o:30,n:"Amós",cat:"profmen",a:"Amós",t:"Justicia social y juicio divino"},
 {o:31,n:"Abdías",cat:"profmen",a:"Abdías",t:"Juicio sobre Edom"},
 {o:32,n:"Jonás",cat:"profmen",a:"Jonás",t:"La misericordia de Dios para Nínive"},
 {o:33,n:"Miqueas",cat:"profmen",a:"Miqueas",t:"Juicio y esperanza mesiánica"},
 {o:34,n:"Nahúm",cat:"profmen",a:"Nahúm",t:"La caída de Nínive"},
 {o:35,n:"Habacuc",cat:"profmen",a:"Habacuc",t:"Fe en medio de la injusticia"},
 {o:36,n:"Sofonías",cat:"profmen",a:"Sofonías",t:"El día del Señor y la restauración"},
 {o:37,n:"Hageo",cat:"profmen",a:"Hageo",t:"Reconstrucción del templo"},
 {o:38,n:"Zacarías",cat:"profmen",a:"Zacarías",t:"Restauración y el Mesías venidero"},
 {o:39,n:"Malaquías",cat:"profmen",a:"Malaquías",t:"Fidelidad y el mensajero venidero"},
 {o:40,n:"Mateo",cat:"evangelios",a:"Mateo",t:"Jesús como el Mesías prometido a Israel"},
 {o:41,n:"Marcos",cat:"evangelios",a:"Marcos",t:"Jesús como siervo que actúa"},
 {o:42,n:"Lucas",cat:"evangelios",a:"Lucas",t:"Jesús como el Hijo del Hombre perfecto"},
 {o:43,n:"Juan",cat:"evangelios",a:"Juan",t:"Jesús como el Hijo de Dios"},
 {o:44,n:"Hechos",cat:"histnt",a:"Lucas",t:"La expansión de la iglesia primitiva"},
 {o:45,n:"Romanos",cat:"paulinas",a:"Pablo",t:"El evangelio y la justicia por fe"},
 {o:46,n:"1 Corintios",cat:"paulinas",a:"Pablo",t:"Orden y unidad en la iglesia"},
 {o:47,n:"2 Corintios",cat:"paulinas",a:"Pablo",t:"Defensa del apostolado de Pablo"},
 {o:48,n:"Gálatas",cat:"paulinas",a:"Pablo",t:"Libertad en Cristo frente al legalismo"},
 {o:49,n:"Efesios",cat:"paulinas",a:"Pablo",t:"La iglesia como cuerpo de Cristo"},
 {o:50,n:"Filipenses",cat:"paulinas",a:"Pablo",t:"El gozo en Cristo"},
 {o:51,n:"Colosenses",cat:"paulinas",a:"Pablo",t:"La supremacía de Cristo"},
 {o:52,n:"1 Tesalonicenses",cat:"paulinas",a:"Pablo",t:"La segunda venida de Cristo"},
 {o:53,n:"2 Tesalonicenses",cat:"paulinas",a:"Pablo",t:"Aclaración sobre el día del Señor"},
 {o:54,n:"1 Timoteo",cat:"paulinas",a:"Pablo",t:"Orden en la iglesia y liderazgo"},
 {o:55,n:"2 Timoteo",cat:"paulinas",a:"Pablo",t:"Últimas instrucciones a Timoteo"},
 {o:56,n:"Tito",cat:"paulinas",a:"Pablo",t:"Orden eclesiástico en Creta"},
 {o:57,n:"Filemón",cat:"paulinas",a:"Pablo",t:"Perdón y reconciliación"},
 {o:58,n:"Hebreos",cat:"generales",a:"Desconocido",t:"La superioridad de Cristo"},
 {o:59,n:"Santiago",cat:"generales",a:"Santiago",t:"Fe viva demostrada en obras"},
 {o:60,n:"1 Pedro",cat:"generales",a:"Pedro",t:"Esperanza en medio del sufrimiento"},
 {o:61,n:"2 Pedro",cat:"generales",a:"Pedro",t:"Advertencia contra falsos maestros"},
 {o:62,n:"1 Juan",cat:"generales",a:"Juan",t:"Certeza de la vida eterna y el amor"},
 {o:63,n:"2 Juan",cat:"generales",a:"Juan",t:"Verdad y amor en la iglesia"},
 {o:64,n:"3 Juan",cat:"generales",a:"Juan",t:"Hospitalidad y fidelidad"},
 {o:65,n:"Judas",cat:"generales",a:"Judas",t:"Contender por la fe"},
 {o:66,n:"Apocalipsis",cat:"apocalipsis",a:"Juan",t:"La victoria final de Cristo"}
];

const CATEGORIES = [
 {id:"pentateuco", name:"Pentateuco",        code:"PEN", color:"var(--c-pentateuco)"},
 {id:"historicos", name:"Históricos",        code:"HIS", color:"var(--c-historicos)"},
 {id:"poeticos",   name:"Poéticos",          code:"POE", color:"var(--c-poeticos)"},
 {id:"profmay",    name:"Profetas Mayores",  code:"PMA", color:"var(--c-profmay)"},
 {id:"profmen",    name:"Profetas Menores",  code:"PME", color:"var(--c-profmen)"},
 {id:"evangelios", name:"Evangelios",        code:"EVA", color:"var(--c-evangelios)"},
 {id:"histnt",     name:"Historia (NT)",     code:"HNT", color:"var(--c-histnt)"},
 {id:"paulinas",   name:"Cartas Paulinas",   code:"PAU", color:"var(--c-paulinas)"},
 {id:"generales",  name:"Cartas Generales",  code:"GEN", color:"var(--c-generales)"},
 {id:"apocalipsis",name:"Apocalipsis",       code:"APO", color:"var(--c-apocalipsis)"}
];
const CAT_MAP = Object.fromEntries(CATEGORIES.map(c=>[c.id,c]));

/* Antiguo vs. Nuevo Testamento, derivado de la categoría de cada libro. */
const NT_CATS = ['evangelios', 'histnt', 'paulinas', 'generales', 'apocalipsis'];
function testament(book){
  return NT_CATS.includes(book.cat) ? 'NT' : 'AT';
}

/* Slugs de la Biblia en Español Sencillo (es-bes), servida por wldeh/bible-api vía jsDelivr.
   Fuente pública, sin necesidad de API key. */
const API_SLUG = {
 "Génesis":"génesis","Éxodo":"éxodo","Levítico":"levítico","Números":"números","Deuteronomio":"deuteronomio",
 "Josué":"josué","Jueces":"jueces","Rut":"rut","1 Samuel":"1samuel","2 Samuel":"2samuel",
 "1 Reyes":"1reyes","2 Reyes":"2reyes","1 Crónicas":"1crónicas","2 Crónicas":"2crónicas",
 "Esdras":"esdras","Nehemías":"nehemías","Ester":"ester","Job":"job","Salmos":"salmos",
 "Proverbios":"proverbios","Eclesiastés":"eclesiastés","Cantares":"cantares","Isaías":"isaías",
 "Jeremías":"jeremías","Lamentaciones":"lamentaciones","Ezequiel":"ezequiel","Daniel":"daniel",
 "Oseas":"oseas","Joel":"joel","Amós":"amós","Abdías":"abdías","Jonás":"jonás","Miqueas":"miqueas",
 "Nahúm":"nahum","Habacuc":"habacuc","Sofonías":"sofonías","Hageo":"hageo","Zacarías":"zacarías",
 "Malaquías":"malaquías","Mateo":"mateo","Marcos":"marcos","Lucas":"lucas","Juan":"juan",
 "Hechos":"hechos","Romanos":"romanos","1 Corintios":"1corintios","2 Corintios":"2corintios",
 "Gálatas":"gálatas","Efesios":"efesios","Filipenses":"filipenses","Colosenses":"colosenses",
 "1 Tesalonicenses":"1tesalonicenses","2 Tesalonicenses":"2tesalonicenses","1 Timoteo":"1timoteo",
 "2 Timoteo":"2timoteo","Tito":"tito","Filemón":"filemón","Hebreos":"hebreos","Santiago":"santiago",
 "1 Pedro":"1pedro","2 Pedro":"2pedro","1 Juan":"1juan","2 Juan":"2juan","3 Juan":"3juan",
 "Judas":"judas","Apocalipsis":"apocalipsis"
};

/* Un capítulo:versículo memorable por libro, usado como muestra en las tarjetas de estudio. */
const SAMPLE_REF = {
 "Génesis":[1,1],"Éxodo":[20,1],"Levítico":[19,18],"Números":[6,24],"Deuteronomio":[6,5],
 "Josué":[1,9],"Jueces":[21,25],"Rut":[1,16],"1 Samuel":[16,7],"2 Samuel":[7,16],
 "1 Reyes":[3,9],"2 Reyes":[2,11],"1 Crónicas":[16,11],"2 Crónicas":[7,14],
 "Esdras":[3,11],"Nehemías":[8,10],"Ester":[4,14],"Job":[19,25],"Salmos":[23,1],
 "Proverbios":[3,5],"Eclesiastés":[3,1],"Cantares":[2,4],"Isaías":[41,10],
 "Jeremías":[29,11],"Lamentaciones":[3,22],"Ezequiel":[36,26],"Daniel":[3,17],
 "Oseas":[6,6],"Joel":[2,25],"Amós":[5,24],"Abdías":[1,15],"Jonás":[2,1],"Miqueas":[6,8],
 "Nahúm":[1,7],"Habacuc":[3,17],"Sofonías":[3,17],"Hageo":[2,9],"Zacarías":[4,6],
 "Malaquías":[3,10],"Mateo":[28,19],"Marcos":[16,15],"Lucas":[2,10],"Juan":[3,16],
 "Hechos":[1,8],"Romanos":[8,28],"1 Corintios":[13,4],"2 Corintios":[5,17],
 "Gálatas":[2,20],"Efesios":[2,8],"Filipenses":[4,13],"Colosenses":[3,23],
 "1 Tesalonicenses":[5,16],"2 Tesalonicenses":[3,3],"1 Timoteo":[4,12],
 "2 Timoteo":[1,7],"Tito":[2,11],"Filemón":[1,7],"Hebreos":[11,1],"Santiago":[1,2],
 "1 Pedro":[5,7],"2 Pedro":[1,3],"1 Juan":[4,19],"2 Juan":[1,6],"3 Juan":[1,4],
 "Judas":[1,24],"Apocalipsis":[21,4]
};

/* Abreviaturas comunes en español -> nombre canónico del libro (tal como aparece en BOOKS). */
const ALIASES = {
 "gn":"Génesis","gen":"Génesis",
 "ex":"Éxodo","exo":"Éxodo",
 "lv":"Levítico","lev":"Levítico",
 "nm":"Números","num":"Números",
 "dt":"Deuteronomio","deut":"Deuteronomio",
 "jos":"Josué",
 "jue":"Jueces","jc":"Jueces",
 "rt":"Rut",
 "1s":"1 Samuel","1sa":"1 Samuel","1sam":"1 Samuel",
 "2s":"2 Samuel","2sa":"2 Samuel","2sam":"2 Samuel",
 "1r":"1 Reyes","1re":"1 Reyes","1rey":"1 Reyes",
 "2r":"2 Reyes","2re":"2 Reyes","2rey":"2 Reyes",
 "1cr":"1 Crónicas","1cro":"1 Crónicas",
 "2cr":"2 Crónicas","2cro":"2 Crónicas",
 "esd":"Esdras",
 "neh":"Nehemías",
 "est":"Ester",
 "sal":"Salmos","salmo":"Salmos","ps":"Salmos",
 "pr":"Proverbios","prov":"Proverbios",
 "ec":"Eclesiastés","ecl":"Eclesiastés",
 "cnt":"Cantares","cant":"Cantares","cantar":"Cantares",
 "is":"Isaías","isa":"Isaías",
 "jer":"Jeremías",
 "lm":"Lamentaciones","lam":"Lamentaciones",
 "ez":"Ezequiel","eze":"Ezequiel",
 "dn":"Daniel","dan":"Daniel",
 "os":"Oseas","ose":"Oseas",
 "jl":"Joel",
 "am":"Amós","amo":"Amós",
 "abd":"Abdías",
 "jon":"Jonás",
 "miq":"Miqueas","mi":"Miqueas",
 "nah":"Nahúm","na":"Nahúm",
 "hab":"Habacuc",
 "sof":"Sofonías",
 "hag":"Hageo",
 "zac":"Zacarías",
 "mal":"Malaquías",
 "mt":"Mateo","mat":"Mateo",
 "mc":"Marcos","mar":"Marcos",
 "lc":"Lucas","luc":"Lucas",
 "jn":"Juan",
 "hch":"Hechos","hech":"Hechos","act":"Hechos","actos":"Hechos",
 "ro":"Romanos","rom":"Romanos",
 "1co":"1 Corintios","1cor":"1 Corintios",
 "2co":"2 Corintios","2cor":"2 Corintios",
 "ga":"Gálatas","gal":"Gálatas",
 "ef":"Efesios","efe":"Efesios",
 "fil":"Filipenses","flp":"Filipenses",
 "col":"Colosenses",
 "1ts":"1 Tesalonicenses","1tes":"1 Tesalonicenses",
 "2ts":"2 Tesalonicenses","2tes":"2 Tesalonicenses",
 "1ti":"1 Timoteo","1tim":"1 Timoteo",
 "2ti":"2 Timoteo","2tim":"2 Timoteo",
 "tit":"Tito",
 "flm":"Filemón",
 "heb":"Hebreos",
 "stg":"Santiago","sant":"Santiago",
 "1p":"1 Pedro","1pe":"1 Pedro",
 "2p":"2 Pedro","2pe":"2 Pedro",
 "1jn":"1 Juan",
 "2jn":"2 Juan",
 "3jn":"3 Juan",
 "jud":"Judas",
 "ap":"Apocalipsis","apo":"Apocalipsis","apoc":"Apocalipsis"
};

function normalize(str){
  return str
    .toLowerCase()
    .normalize('NFD').replace(/[̀-ͯ]/g,'')
    .replace(/\s+/g,' ')
    .trim();
}

/* Igual que normalize(), pero sin recortar/colapsar espacios: mantiene el mismo largo
   que el texto original, carácter a carácter, para poder resaltar coincidencias por índice. */
function normalizeKeepLength(str){
  return str.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g,'');
}

const SEARCH_TOPICS = ['Amor','Fe','Esperanza','Perdón','Paz','Sabiduría','Miedo','Familia','Oración','Salvación'];

const BOOK_LOOKUP = {};
BOOKS.forEach(b=>{ BOOK_LOOKUP[normalize(b.n)] = b; });
Object.entries(ALIASES).forEach(([alias, fullName])=>{
  const book = BOOKS.find(b=>b.n===fullName);
  if(book) BOOK_LOOKUP[normalize(alias)] = book;
});

/* Nombre de archivo local para el texto completo de un libro, ej: "43-juan.json". */
function fileSlug(book){
  return String(book.o).padStart(2, '0') + '-' + normalize(book.n).replace(/\s+/g, '-');
}
const BIBLE_DATA_DIR = 'data/bible/es-bes';
