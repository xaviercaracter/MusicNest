/// <reference path="../pb_migrations_types.d.ts" />

// Extend the built-in users auth collection with custom fields
migrate(($app) => {
  const collection = $app.findCollectionByNameOrId("_pb_users_auth_")
  
  // Add username field
  collection.fields.addAt(5, new Field({
    name: "username",
    type: "text",
    required: true,
    presentable: false,
    unique: false,
    options: {
      min: 3,
      max: 50,
      pattern: "",
    },
  }))
  
  // Add bio field
  collection.fields.addAt(6, new Field({
    name: "bio",
    type: "text",
    required: false,
    presentable: false,
    unique: false,
    options: {
      min: null,
      max: 500,
      pattern: "",
    },
  }))
  
  // Add feedbackCredits field
  collection.fields.addAt(7, new Field({
    name: "feedbackCredits",
    type: "number",
    required: true,
    presentable: false,
    unique: false,
    options: {
      min: 0,
      max: null,
      noDecimal: true,
    },
  }))
  
  return $app.save(collection)
}, ($app) => {
  const collection = $app.findCollectionByNameOrId("_pb_users_auth_")
  
  // Remove custom fields
  collection.fields.removeById("username")
  collection.fields.removeById("bio")
  collection.fields.removeById("feedbackCredits")
  
  return $app.save(collection)
})

// Create beats collection
migrate(($app) => {
  const dao = $app.dao()
  
  const collection = new Collection()
  collection.name = "beats"
  collection.type = "base"
  collection.listRule = ""
  collection.viewRule = ""
  collection.createRule = "@request.auth.id != ''"
  collection.updateRule = "userId = @request.auth.id"
  collection.deleteRule = "userId = @request.auth.id"
  
  // title field
  collection.fields.add(new Field({
    name: "title",
    type: "text",
    required: true,
    options: { min: 1, max: 200 },
  }))
  
  // audioUrl field
  collection.fields.add(new Field({
    name: "audioUrl",
    type: "text",
    required: true,
    options: { min: 1, max: 2000 },
  }))
  
  // bpm field
  collection.fields.add(new Field({
    name: "bpm",
    type: "number",
    required: false,
    options: { min: 20, max: 300, noDecimal: true },
  }))
  
  // key field
  collection.fields.add(new Field({
    name: "key",
    type: "text",
    required: false,
    options: { max: 10 },
  }))
  
  // tags field
  collection.fields.add(new Field({
    name: "tags",
    type: "json",
    required: false,
  }))
  
  // userId field (relation)
  collection.fields.add(new Field({
    name: "userId",
    type: "relation",
    required: true,
    options: {
      collectionId: "_pb_users_auth_",
      cascadeDelete: true,
      maxSelect: 1,
    },
  }))
  
  // plays field
  collection.fields.add(new Field({
    name: "plays",
    type: "number",
    required: true,
    options: { min: 0, noDecimal: true },
  }))
  
  // likes field
  collection.fields.add(new Field({
    name: "likes",
    type: "number",
    required: true,
    options: { min: 0, noDecimal: true },
  }))
  
  // comments field
  collection.fields.add(new Field({
    name: "comments",
    type: "number",
    required: true,
    options: { min: 0, noDecimal: true },
  }))
  
  return dao.saveCollection(collection)
}, ($app) => {
  const dao = $app.dao()
  const collection = dao.findCollectionByNameOrId("beats")
  return dao.deleteCollection(collection)
})

// Create comments collection
migrate(($app) => {
  const dao = $app.dao()
  
  const collection = new Collection()
  collection.name = "comments"
  collection.type = "base"
  collection.listRule = ""
  collection.viewRule = ""
  collection.createRule = "@request.auth.id != ''"
  collection.updateRule = "userId = @request.auth.id"
  collection.deleteRule = "userId = @request.auth.id"
  
  collection.fields.add(new Field({
    name: "content",
    type: "text",
    required: true,
    options: { min: 1, max: 2000 },
  }))
  
  collection.fields.add(new Field({
    name: "beatId",
    type: "relation",
    required: true,
    options: {
      collectionId: "beats",
      cascadeDelete: true,
      maxSelect: 1,
    },
  }))
  
  collection.fields.add(new Field({
    name: "userId",
    type: "relation",
    required: true,
    options: {
      collectionId: "_pb_users_auth_",
      cascadeDelete: true,
      maxSelect: 1,
    },
  }))
  
  return dao.saveCollection(collection)
}, ($app) => {
  const dao = $app.dao()
  const collection = dao.findCollectionByNameOrId("comments")
  return dao.deleteCollection(collection)
})

// Create likes collection
migrate(($app) => {
  const dao = $app.dao()
  
  const collection = new Collection()
  collection.name = "likes"
  collection.type = "base"
  collection.listRule = ""
  collection.viewRule = ""
  collection.createRule = "@request.auth.id != ''"
  collection.updateRule = ""
  collection.deleteRule = "userId = @request.auth.id"
  
  collection.fields.add(new Field({
    name: "beatId",
    type: "relation",
    required: true,
    options: {
      collectionId: "beats",
      cascadeDelete: true,
      maxSelect: 1,
    },
  }))
  
  collection.fields.add(new Field({
    name: "userId",
    type: "relation",
    required: true,
    options: {
      collectionId: "_pb_users_auth_",
      cascadeDelete: true,
      maxSelect: 1,
    },
  }))
  
  collection.indexes = ["CREATE UNIQUE INDEX idx_unique_like ON likes (beatId, userId)"]
  
  return dao.saveCollection(collection)
}, ($app) => {
  const dao = $app.dao()
  const collection = dao.findCollectionByNameOrId("likes")
  return dao.deleteCollection(collection)
})

// Create follows collection
migrate(($app) => {
  const dao = $app.dao()
  
  const collection = new Collection()
  collection.name = "follows"
  collection.type = "base"
  collection.listRule = ""
  collection.viewRule = ""
  collection.createRule = "@request.auth.id != ''"
  collection.updateRule = ""
  collection.deleteRule = "followerId = @request.auth.id"
  
  collection.fields.add(new Field({
    name: "followerId",
    type: "relation",
    required: true,
    options: {
      collectionId: "_pb_users_auth_",
      cascadeDelete: true,
      maxSelect: 1,
    },
  }))
  
  collection.fields.add(new Field({
    name: "followingId",
    type: "relation",
    required: true,
    options: {
      collectionId: "_pb_users_auth_",
      cascadeDelete: true,
      maxSelect: 1,
    },
  }))
  
  collection.indexes = ["CREATE UNIQUE INDEX idx_unique_follow ON follows (followerId, followingId)"]
  
  return dao.saveCollection(collection)
}, ($app) => {
  const dao = $app.dao()
  const collection = dao.findCollectionByNameOrId("follows")
  return dao.deleteCollection(collection)
})

// Create plays collection
migrate(($app) => {
  const dao = $app.dao()
  
  const collection = new Collection()
  collection.name = "plays"
  collection.type = "base"
  collection.listRule = ""
  collection.viewRule = ""
  collection.createRule = ""
  collection.updateRule = ""
  collection.deleteRule = ""
  
  collection.fields.add(new Field({
    name: "beatId",
    type: "relation",
    required: true,
    options: {
      collectionId: "beats",
      cascadeDelete: true,
      maxSelect: 1,
    },
  }))
  
  collection.fields.add(new Field({
    name: "userId",
    type: "relation",
    required: false,
    options: {
      collectionId: "_pb_users_auth_",
      cascadeDelete: true,
      maxSelect: 1,
    },
  }))
  
  return dao.saveCollection(collection)
}, ($app) => {
  const dao = $app.dao()
  const collection = dao.findCollectionByNameOrId("plays")
  return dao.deleteCollection(collection)
})

// Create battles collection
migrate(($app) => {
  const dao = $app.dao()
  
  const collection = new Collection()
  collection.name = "battles"
  collection.type = "base"
  collection.listRule = ""
  collection.viewRule = ""
  collection.createRule = ""
  collection.updateRule = ""
  collection.deleteRule = ""
  
  collection.fields.add(new Field({
    name: "title",
    type: "text",
    required: true,
    options: { min: 1, max: 200 },
  }))
  
  collection.fields.add(new Field({
    name: "description",
    type: "text",
    required: false,
    options: { max: 2000 },
  }))
  
  collection.fields.add(new Field({
    name: "status",
    type: "select",
    required: true,
    options: {
      maxSelect: 1,
      values: ["upcoming", "active", "ended"],
    },
  }))
  
  return dao.saveCollection(collection)
}, ($app) => {
  const dao = $app.dao()
  const collection = dao.findCollectionByNameOrId("battles")
  return dao.deleteCollection(collection)
})
