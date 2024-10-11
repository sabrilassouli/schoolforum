exports.seed = async function (knex) {
  // Deletes ALL existing entries
  await knex("answers").del();

  // Inserts seed entries
  await knex("answers").insert([
    {
      creator_id: 1,
      question_id: 1,
      comment:
        "Docker is an open platform that allows developers to automate the deployment, scaling, and management of applications using lightweight, portable containers.",
      upvotes: 3,
    },
    {
      creator_id: 1,
      question_id: 2,
      comment:
        "To make a font, you can use font creation software like FontForge or Glyphs to design and customize characters, then export it as a font file (e.g., .ttf or .otf).",
      upvotes: 4,
    },
    {
      creator_id: 1,
      question_id: 3,
      comment:
        "A shader is a program used in computer graphics to control the rendering of surfaces, lighting, and effects by manipulating pixels and vertices on the GPU.",
      upvotes: 5,
    },
  ]);
};
