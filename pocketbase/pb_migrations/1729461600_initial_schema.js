/// <reference path="../pb_migrations_types.d.ts" />

migrate((db) => {
  // Create users collection (auth)
  const usersCollection = new Collection({
    id: "users",
    name: "users",
    type: "auth",
    system: false,
    schema: [
      {
        id: "username",
        name: "username",
        type: "text",
        required: true,
        unique: true,
        options: {
          min: 3,
          max: 50,
          pattern: "",
        },
      },
      {
        id: "bio",
        name: "bio",
        type: "text",
        required: false,
        options: {
          min: null,
          max: 500,
          pattern: "",
        },
      },
      {
        id: "avatar",
        name: "avatar",
        type: "file",
        required: false,
        options: {
          maxSelect: 1,
          maxSize: 5242880,
          mimeTypes: ["image/jpeg", "image/png", "image/webp", "image/gif"],
          thumbs: ["100x100"],
        },
      },
      {
        id: "feedbackCredits",
        name: "feedbackCredits",
        type: "number",
        required: true,
        options: {
          min: 0,
          max: null,
        },
      },
    ],
    indexes: [],
    listRule: "",
    viewRule: "",
    createRule: "",
    updateRule: "id = @request.auth.id",
    deleteRule: "id = @request.auth.id",
    options: {
      allowEmailAuth: true,
      allowOAuth2Auth: false,
      allowUsernameAuth: false,
      exceptEmailDomains: [],
      manageRule: null,
      minPasswordLength: 8,
      onlyEmailDomains: [],
      requireEmail: true,
    },
  });
  
  return Dao(db).saveCollection(usersCollection);
}, (db) => {
  return Dao(db).deleteCollection(Dao(db).findCollectionByNameOrId("users"));
});

migrate((db) => {
  // Create beats collection
  const beatsCollection = new Collection({
    id: "beats",
    name: "beats",
    type: "base",
    system: false,
    schema: [
      {
        id: "title",
        name: "title",
        type: "text",
        required: true,
        options: {
          min: 1,
          max: 200,
          pattern: "",
        },
      },
      {
        id: "audioUrl",
        name: "audioUrl",
        type: "text",
        required: true,
        options: {
          min: 1,
          max: 2000,
          pattern: "",
        },
      },
      {
        id: "bpm",
        name: "bpm",
        type: "number",
        required: false,
        options: {
          min: 20,
          max: 300,
        },
      },
      {
        id: "key",
        name: "key",
        type: "text",
        required: false,
        options: {
          min: null,
          max: 10,
          pattern: "",
        },
      },
      {
        id: "tags",
        name: "tags",
        type: "json",
        required: false,
        options: {},
      },
      {
        id: "userId",
        name: "userId",
        type: "relation",
        required: true,
        options: {
          collectionId: "users",
          cascadeDelete: true,
          minSelect: null,
          maxSelect: 1,
          displayFields: ["username"],
        },
      },
      {
        id: "plays",
        name: "plays",
        type: "number",
        required: true,
        options: {
          min: 0,
          max: null,
        },
      },
      {
        id: "likes",
        name: "likes",
        type: "number",
        required: true,
        options: {
          min: 0,
          max: null,
        },
      },
      {
        id: "comments",
        name: "comments",
        type: "number",
        required: true,
        options: {
          min: 0,
          max: null,
        },
      },
    ],
    indexes: [],
    listRule: "",
    viewRule: "",
    createRule: "@request.auth.id != ''",
    updateRule: "userId = @request.auth.id",
    deleteRule: "userId = @request.auth.id",
  });
  
  return Dao(db).saveCollection(beatsCollection);
}, (db) => {
  return Dao(db).deleteCollection(Dao(db).findCollectionByNameOrId("beats"));
});

migrate((db) => {
  // Create comments collection
  const commentsCollection = new Collection({
    id: "comments",
    name: "comments",
    type: "base",
    system: false,
    schema: [
      {
        id: "content",
        name: "content",
        type: "text",
        required: true,
        options: {
          min: 1,
          max: 2000,
          pattern: "",
        },
      },
      {
        id: "beatId",
        name: "beatId",
        type: "relation",
        required: true,
        options: {
          collectionId: "beats",
          cascadeDelete: true,
          minSelect: null,
          maxSelect: 1,
          displayFields: ["title"],
        },
      },
      {
        id: "userId",
        name: "userId",
        type: "relation",
        required: true,
        options: {
          collectionId: "users",
          cascadeDelete: true,
          minSelect: null,
          maxSelect: 1,
          displayFields: ["username"],
        },
      },
    ],
    indexes: [],
    listRule: "",
    viewRule: "",
    createRule: "@request.auth.id != ''",
    updateRule: "userId = @request.auth.id",
    deleteRule: "userId = @request.auth.id",
  });
  
  return Dao(db).saveCollection(commentsCollection);
}, (db) => {
  return Dao(db).deleteCollection(Dao(db).findCollectionByNameOrId("comments"));
});

migrate((db) => {
  // Create likes collection
  const likesCollection = new Collection({
    id: "likes",
    name: "likes",
    type: "base",
    system: false,
    schema: [
      {
        id: "beatId",
        name: "beatId",
        type: "relation",
        required: true,
        options: {
          collectionId: "beats",
          cascadeDelete: true,
          minSelect: null,
          maxSelect: 1,
          displayFields: ["title"],
        },
      },
      {
        id: "userId",
        name: "userId",
        type: "relation",
        required: true,
        options: {
          collectionId: "users",
          cascadeDelete: true,
          minSelect: null,
          maxSelect: 1,
          displayFields: ["username"],
        },
      },
    ],
    indexes: [
      "CREATE UNIQUE INDEX idx_unique_like ON likes (beatId, userId)"
    ],
    listRule: "",
    viewRule: "",
    createRule: "@request.auth.id != ''",
    updateRule: "",
    deleteRule: "userId = @request.auth.id",
  });
  
  return Dao(db).saveCollection(likesCollection);
}, (db) => {
  return Dao(db).deleteCollection(Dao(db).findCollectionByNameOrId("likes"));
});

migrate((db) => {
  // Create follows collection
  const followsCollection = new Collection({
    id: "follows",
    name: "follows",
    type: "base",
    system: false,
    schema: [
      {
        id: "followerId",
        name: "followerId",
        type: "relation",
        required: true,
        options: {
          collectionId: "users",
          cascadeDelete: true,
          minSelect: null,
          maxSelect: 1,
          displayFields: ["username"],
        },
      },
      {
        id: "followingId",
        name: "followingId",
        type: "relation",
        required: true,
        options: {
          collectionId: "users",
          cascadeDelete: true,
          minSelect: null,
          maxSelect: 1,
          displayFields: ["username"],
        },
      },
    ],
    indexes: [
      "CREATE UNIQUE INDEX idx_unique_follow ON follows (followerId, followingId)"
    ],
    listRule: "",
    viewRule: "",
    createRule: "@request.auth.id != ''",
    updateRule: "",
    deleteRule: "followerId = @request.auth.id",
  });
  
  return Dao(db).saveCollection(followsCollection);
}, (db) => {
  return Dao(db).deleteCollection(Dao(db).findCollectionByNameOrId("follows"));
});

migrate((db) => {
  // Create plays collection
  const playsCollection = new Collection({
    id: "plays",
    name: "plays",
    type: "base",
    system: false,
    schema: [
      {
        id: "beatId",
        name: "beatId",
        type: "relation",
        required: true,
        options: {
          collectionId: "beats",
          cascadeDelete: true,
          minSelect: null,
          maxSelect: 1,
          displayFields: ["title"],
        },
      },
      {
        id: "userId",
        name: "userId",
        type: "relation",
        required: false,
        options: {
          collectionId: "users",
          cascadeDelete: true,
          minSelect: null,
          maxSelect: 1,
          displayFields: ["username"],
        },
      },
    ],
    indexes: [],
    listRule: "",
    viewRule: "",
    createRule: "",
    updateRule: "",
    deleteRule: "",
  });
  
  return Dao(db).saveCollection(playsCollection);
}, (db) => {
  return Dao(db).deleteCollection(Dao(db).findCollectionByNameOrId("plays"));
});

migrate((db) => {
  // Create battles collection
  const battlesCollection = new Collection({
    id: "battles",
    name: "battles",
    type: "base",
    system: false,
    schema: [
      {
        id: "title",
        name: "title",
        type: "text",
        required: true,
        options: {
          min: 1,
          max: 200,
          pattern: "",
        },
      },
      {
        id: "description",
        name: "description",
        type: "text",
        required: false,
        options: {
          min: null,
          max: 2000,
          pattern: "",
        },
      },
      {
        id: "status",
        name: "status",
        type: "select",
        required: true,
        options: {
          maxSelect: 1,
          values: ["upcoming", "active", "ended"],
        },
      },
    ],
    indexes: [],
    listRule: "",
    viewRule: "",
    createRule: "",
    updateRule: "",
    deleteRule: "",
  });
  
  return Dao(db).saveCollection(battlesCollection);
}, (db) => {
  return Dao(db).deleteCollection(Dao(db).findCollectionByNameOrId("battles"));
});
