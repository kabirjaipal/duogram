import {
  Account,
  Avatars,
  Client,
  Databases,
  ID,
  Query,
  Storage,
} from "react-native-appwrite";

export const config = {
  endpoint: "https://cloud.appwrite.io/v1",
  platform: "com.kabirjaipal.duogram",
  projectId: "6678559c0032fe735040",
  databaseId: "66798f5b003e48eb5c23",
  userCollectionId: "66798f7000323f4a655a",
  relationshipCollectionId: "66814613003d97d8e71a",
  specialDaysCollectionId: "6681476f002fac3516f4",
  messagesCollectionId: "669557c80019956f711e",
  messagesMediaBucketId: "66e6e85c002ad8407c11",
};

const client = new Client();
client
  .setEndpoint(config.endpoint)
  .setProject(config.projectId)
  .setPlatform(config.platform);

export const account = new Account(client);
export const avatars = new Avatars(client);
export const storage = new Storage(client);
export const databases = new Databases(client);

// Register user
export async function createUser(
  email: string,
  password: string,
  username: string,
  gender: string
) {
  try {
    const [newAccount, avatarUrl, session] = await Promise.all([
      account.create(ID.unique(), email, password, username),
      avatars.getInitials(username),
      signIn(email, password),
    ]);

    const newUser = await databases.createDocument(
      config.databaseId,
      config.userCollectionId,
      ID.unique(),
      {
        accountId: newAccount.$id,
        email: email,
        username: username,
        avatar: avatarUrl,
        gender: gender,
      }
    );

    return newUser;
  } catch (error) {
    console.error("Error creating user:", error);
    return null;
  }
}

// Sign In
export async function signIn(email: string, password: string) {
  try {
    const session = await account.createEmailPasswordSession(email, password);
    return session;
  } catch (error: any) {
    return error?.message as string;
  }
}

// Get Current User
export async function getCurrentUser() {
  try {
    const currentAccount = await account.get();
    if (!currentAccount) return null;

    const currentUser = await databases.listDocuments(
      config.databaseId,
      config.userCollectionId,
      [Query.equal("accountId", currentAccount.$id)]
    );

    return currentUser.documents[0] ?? null;
  } catch (error) {
    return null;
  }
}

// Update User
export async function updateUser(userId: string, data: any) {
  try {
    const updatedUser = await databases.updateDocument(
      config.databaseId,
      config.userCollectionId,
      userId,
      data
    );
    return updatedUser;
  } catch (error) {
    console.error("Error updating user:", error);
  }
}

// Sign Out
export async function signOut() {
  try {
    const session = await account.deleteSession("current");
    return session;
  } catch (error) {
    console.error("Error signing out:", error);
  }
}

// Create Relationship
export async function createRelationship(connectionCode: string) {
  try {
    const currentUser = await getCurrentUser();
    if (!currentUser) throw Error;

    const newRelationship = await databases.createDocument(
      config.databaseId,
      config.relationshipCollectionId,
      ID.unique(),
      {
        husbandId: currentUser.gender === "male" ? currentUser.$id : null,
        wifeId: currentUser.gender === "female" ? currentUser.$id : null,
        connectionCode: connectionCode,
        relationshipDate: new Date().toISOString(),
      }
    );

    await updateUser(currentUser.$id, {
      relationshipId: newRelationship.$id,
    });

    return newRelationship;
  } catch (error) {
    console.error("Error creating relationship:", error);
    return null;
  }
}

// Get Relationship
export async function getRelationship(relationshipId: string) {
  try {
    const relationship = await databases.listDocuments(
      config.databaseId,
      config.relationshipCollectionId,
      [Query.equal("$id", relationshipId)]
    );

    return relationship.documents[0] ?? null;
  } catch (error) {
    console.error("Error getting relationship:", error);
    return null;
  }
}

// Delete Relationship
export async function deleteRelationship(relationshipId: string) {
  try {
    const relationship = await databases.deleteDocument(
      config.databaseId,
      config.relationshipCollectionId,
      relationshipId
    );

    return relationship;
  } catch (error) {
    console.error("Error deleting relationship:", error);
  }
}

// Join Relationship
export async function joinRelationship(connectionCode: string) {
  try {
    const currentUser = await getCurrentUser();
    if (!currentUser) return;

    const relationship = await databases.listDocuments(
      config.databaseId,
      config.relationshipCollectionId,
      [Query.equal("connectionCode", connectionCode)]
    );

    if (!relationship.documents.length) return;

    const relationshipData = relationship.documents[0];
    const isHusband = currentUser.gender === "male";
    const isWife = currentUser.gender === "female";

    const updatedRelationship = await databases.updateDocument(
      config.databaseId,
      config.relationshipCollectionId,
      relationshipData.$id,
      {
        husbandId: isHusband ? currentUser.$id : relationshipData.husbandId,
        wifeId: isWife ? currentUser.$id : relationshipData.wifeId,
      }
    );

    await updateUser(currentUser.$id, {
      relationshipId: relationshipData.$id,
    });

    return updatedRelationship;
  } catch (error) {
    console.error("Error joining relationship:", error);
  }
}

// Update User Details like device info, location, etc.
export async function updatePartnerInfo(userId: string, data: any) {
  try {
    const updatedUser = await databases.updateDocument(
      config.databaseId,
      config.userCollectionId,
      userId,
      { info: data }
    );

    return updatedUser;
  } catch (error) {
    console.error("Error updating partner info:", error);
  }
}

// Get Partner Info from relationship id and user id
export async function getPartnerInfo(relationshipId: string, userId: string) {
  try {
    const relationship = await getRelationship(relationshipId);
    if (!relationship) return null;

    const partnerId =
      relationship.husbandId === userId
        ? relationship.wifeId
        : relationship.husbandId;

    const partner = await databases.listDocuments(
      config.databaseId,
      config.userCollectionId,
      [Query.equal("$id", partnerId)]
    );

    return partner.documents[0] ?? null;
  } catch (error) {
    console.error("Error getting partner info:", error);
    return null;
  }
}

export default client;
