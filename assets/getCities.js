const { db } = require("./db");

async function getAllCities() {
  try {
    const snapshot = await db.collection("Cities").get();
    const result = snapshot.docs.map(doc => doc.data());
    return result;
  } catch (error) {
    console.error("Erro ao obter cidades:", error);
    throw error; // Lança o erro para que possa ser tratado externamente, se necessário
  }
};

async function showCities(){
  const allCities = await getAllCities();
  console.log("Todas as Cidades: " + allCities);
}

showCities();