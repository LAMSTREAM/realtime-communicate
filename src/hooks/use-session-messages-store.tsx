
import {create} from "zustand";
import {immer} from "zustand/middleware/immer";

export type RemoteMessage = {
  sender: {
    id: number;
    name: string;
    image: string;
  },
  ctime: Date;
  read: boolean;
  type: string;
  payload: string;

  sessionId: number;
  id: number; // db.message.id means remote msg
}

export type LocalMessage = {
  sender: {
    id: number;
    name: string;
    image: string;
  },
  ctime: Date;
  read: boolean;
  type: string;
  payload: string;

  sessionId: number;
  id: number; // Number(`${userid}${Date.now()}`) means local msg
  isLocal: true;
}

export type Message = RemoteMessage | LocalMessage
type Session = {
  messages: { [key: string]: Message; }; // key equals to message.id
  messageOrder: number[]; // MessageBar in desc order, for render convenient
}


type useSessionMessagesStore = {
  sessions: { [key: string]: Session }, // key equals to session.id
  addMessage: (sessionId: number, msg: Message) => void;
  updateMessage: (sessionId: number, msg: Message, localId: number) => void;
  appendMessages: (sessionId: number, remoteMsgs: RemoteMessage[]) => void; // Append message history
  reset: () => void;
}

// For js object, obj[number] will be transfer to obj[string] automatically,
//     so the type of sessionId and localId would work well.

export const useSessionMessagesStore = create<useSessionMessagesStore>()(
  immer((set) => ({
    sessions: {},
    // For remote message upsert, and local message insert
    addMessage: (sessionId, msg) => {
      set(state => {
        if(state.sessions[sessionId] === undefined)state.sessions[sessionId] = emptySession()
        const _session = state.sessions[sessionId]
        // If not exist, find the place it should be inserted
        if(_session.messages[msg.id] === undefined){
          const index = binarySearch(_session.messageOrder, msg, _session.messages);
          _session.messageOrder.splice(index, 0, msg.id);
        }
        // Replace new
        _session.messages[msg.id] = msg;
      });
    },
    // For update local message to remote
    updateMessage: (sessionId, msg, localId) => {
      set(state => {
        if(state.sessions[sessionId] === undefined)state.sessions[sessionId] = emptySession()
        const _session = state.sessions[sessionId]
        if (_session.messages[localId]) {
          delete _session.messages[localId];
          _session.messages[msg.id] = msg;
          const index = _session.messageOrder.indexOf(localId);
          if (index !== -1) {
            _session.messageOrder[index] = msg.id;
          }
        }
      });
    },
    appendMessages: (sessionId, remoteMsgs) => {
      set(state => {
        if(state.sessions[sessionId] === undefined)state.sessions[sessionId] = emptySession()
        const _session = state.sessions[sessionId]
        // Filter exist msgs
        remoteMsgs = remoteMsgs.filter((msg) => {
          if(_session.messages[msg.id] === undefined){
            return true
          }else{
            _session.messages[msg.id] = msg
            return false
          }
        })
        // Sort the new messages if not already sorted
        remoteMsgs.sort((a, b) => b.ctime.getTime() - a.ctime.getTime());
        // Merge sorted arrays in descending order
        const newOrder = [];
        let i = 0, j = 0;
        while (i < remoteMsgs.length && j < _session.messageOrder.length) {
          const msgA = _session.messages[_session.messageOrder[j]];
          const msgB = remoteMsgs[i];
          if (msgA.ctime.getTime() >= msgB.ctime.getTime()) {
            newOrder.push(_session.messageOrder[j++]);
          } else {
            _session.messages[msgB.id] = msgB; // Ensure the message is added to the store
            newOrder.push(msgB.id);
            i++;
          }
        }
        // If there are remaining new messages
        while (i < remoteMsgs.length) {
          const msg = remoteMsgs[i++];
          _session.messages[msg.id] = msg; // Add remaining new messages
          newOrder.push(msg.id);
        }
        // If there are remaining existing messages
        while (j < _session.messageOrder.length) {
          newOrder.push(_session.messageOrder[j++]);
        }

        // Update the state with the new order
        _session.messageOrder = newOrder;
      });
    },
    reset: () => {
      set(state => {
        state.sessions = {}
      })
    }
  }))
);

function binarySearch(order: number[], newMessage: Message, messages: { [id: number]: Message }): number {
  let low = 0, high = order.length;
  while (low < high) {
    let mid = Math.floor((low + high) / 2);
    if (new Date(messages[order[mid]].ctime) > new Date(newMessage.ctime)) {
      low = mid + 1;
    } else {
      high = mid;
    }
  }
  return low;
}

function emptySession(){

  return {
    messages: {},
    messageOrder: []
  }
}