import { async } from "@firebase/util";
import { dbService, storageService } from "fbase";
import { doc, deleteDoc, updateDoc } from "firebase/firestore";
import { useState } from "react";
import { deleteObject, ref } from "firebase/storage";

const Tweet = ({ tweetObj, isOwner }) => {
  const TweetTextRef = doc(dbService, "tweets", `${tweetObj.id}`);
  const [editing, setEditing] = useState(false);
  const [newTweet, setNewTweet] = useState(tweetObj.text);
  //삭제하려는 이미지 파일 가리키는 ref 생성하기
  // tweetObj attachmentUrl이 바로 삭제하려는 그 url임
  const desertRef = ref(storageService, tweetObj.attachmentUrl);
  const onDelete = async () => {
    const ok = window.confirm("해당 게시물을 삭제하시겠습니까?");
    if (ok) {
      await deleteDoc(TweetTextRef);
      if (tweetObj.attachmentUrl !== "") {
        await deleteObject(desertRef);
      }
    }
  };
  const toggleEditing = () => setEditing((prev) => !prev);
  const onSubmit = async (event) => {
    event.preventDefault();
    await updateDoc(TweetTextRef, {
      text: newTweet,
    });
    setEditing(false);
  };
  const onChange = (event) => {
    const {
      target: { value },
    } = event;
    setNewTweet(value);
  };
  return (
    <div key={tweetObj.id}>
      {editing ? (
        <>
          {isOwner && (
            <>
              <form onSubmit={onSubmit}>
                <input
                  type="text"
                  placeholder="Edit your Tweet"
                  value={newTweet}
                  onChange={onChange}
                  required
                />

                <input type="submit" value="Update Tweet" />
                <button onClick={toggleEditing}>Cancel</button>
              </form>
            </>
          )}
        </>
      ) : (
        <>
          <h4>{tweetObj.text}</h4>
          {tweetObj.attachmentUrl && (
            <img
              src={tweetObj.attachmentUrl}
              alt="tweet attachmentFile"
              width="100px"
              height="100px"
            />
          )}
          {isOwner && (
            <>
              <button onClick={toggleEditing}>Edit Tweet</button>
              <button onClick={onDelete}>Delete Tweet</button>
            </>
          )}
        </>
      )}
    </div>
  );
};

export default Tweet;
