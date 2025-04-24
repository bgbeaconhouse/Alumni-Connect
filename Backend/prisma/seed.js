const prisma = require("../prisma");
const seed = async () => {
 
    const createUsers = async () => {
        const users = [
            {username: "benny", password: "ben1", firstName: "Ben", lastName: "Stronghold", email: "ben10@gmail.com", phoneNumber: "(714) 456-0987", profileImage: "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png", yearGraduated: "2020" },
            {username: "jacoby", password: "jacob1", firstName: "Jacob", lastName: "Manning", email: "jacob10@gmail.com", phoneNumber: "(714) 456-0997", profileImage: "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png", yearGraduated: "2021" },
            {username: "terryboy", password: "terry1", firstName: "Terry", lastName: "Cupold", email: "terry10@gmail.com", phoneNumber: "(714) 433-0987", profileImage: "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png", yearGraduated: "2019" },
            {username: "henryboy", password: "henry1", firstName: "Henry", lastName: "Gustof", email: "henry10@gmail.com", phoneNumber: "(714) 768-0987", profileImage: "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png", yearGraduated: "2022" },
            {username: "hunterboy", password: "hunter1", firstName: "Hunter", lastName: "Loren", email: "hunter10@gmail.com", phoneNumber: "(714) 456-0987", profileImage: "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png", yearGraduated: "2020" },

        ]
        await prisma.user.createMany({data: users})
    };

    const createPosts = async () => {
        const posts = [
            {userId: 1, textContent: "10 years sober, happy to be alive and living well!", imageContent: "https://www.washburnhouse.com/wp-content/uploads/2018/12/7-Fun-Ways-To-Throw-a-Sober-Party.jpeg"},
            {userId: 2, textContent: "Happy National Sober Day! Keep it up beacon boys.", imageContent: "https://www.statmedevac.com/wp-content/uploads/2024/08/Red-Wheelchair-Signage-Alcohol-Awareness-Social-Media-Graphic-300x300.png"},
            { userId: 3, textContent: "Made some digital art themed sobriety, check one of them out.", imageContent: "https://inmagazine.ca/wp-content/uploads/2019/11/The-Rise-Of-The-Sober-Queer.jpg"},
        ]
        await prisma.post.createMany({data: posts})
    };

    const createLikes = async () => {
        const likes = [
            {userId: 1, postId: 2 },
            {userId: 2, postId: 3},
            {userId: 3, postId: 1},
        ]
        await prisma.like.createMany({data: likes})
    };

    const createComments = async () => {
        const comments = [
            {textContent: "Same to you brother! Miss you.", userId: 1, postId: 2},
            {textContent: "Wow, congrats man!", userId: 3, postId: 1},
            {textContent: "I see you finally put your artistic talent to work! Nice stuff", userId: 2, postId: 3 }
        ]
        await prisma.comment.createMany({data: comments})
    }

    await createUsers();
    await createPosts();
    await createLikes();
    await createComments();
};
seed()
  .then(async () => await prisma.$disconnect())
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });