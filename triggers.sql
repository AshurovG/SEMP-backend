CREATE OR REPLACE FUNCTION delete_comments_and_post()
RETURNS TRIGGER AS $$
BEGIN
  DELETE FROM "Comments" WHERE "postID" = OLD."id";
  RETURN OLD;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER delete_comments_and_post
BEFORE DELETE ON "Posts"
FOR EACH ROW
EXECUTE FUNCTION delete_comments_and_post();

CREATE OR REPLACE FUNCTION delete_chat_messages_users()
RETURNS TRIGGER AS $$
BEGIN
  DELETE FROM "UserChats" WHERE "chatID" = OLD."id";
  DELETE FROM "Messages" WHERE "chatID" = OLD."id";
  RETURN OLD;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER delete_chat_messages_users
BEFORE DELETE ON "Chats"
FOR EACH ROW
EXECUTE FUNCTION delete_chat_messages_users();