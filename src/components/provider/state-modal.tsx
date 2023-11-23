'use client'

import React, {createContext, useContext, useState} from "react";
import StateModal from "@/components/stateindicate/StateModal";

type StateModalState = 'Loading' | 'Failed' | 'Succeed' | '';
type StateModalDesc = string | undefined;

type StateModalDataType = {
  state: StateModalState;
  desc: StateModalDesc
}

type SetModalType = {
  setModal: (data: StateModalDataType)=>void;
  modalData: StateModalDataType;
}

const StateModalContext = createContext<SetModalType>({
  setModal: ()=>{},
  modalData: {
    state: '',
    desc: ''
  }
})

export const useStateModal = () => {
  return useContext(StateModalContext);
}

export const StateModalProvider = ({
  children
}: {
  children: React.ReactNode
}) => {
  const [modalData, setModalData] = useState<StateModalDataType>({
    state: '',
    desc: ''
  })

  const setModal = (data: StateModalDataType) => {
    setModalData(data)
  }

  return (
    <StateModalContext.Provider value={{modalData, setModal}}>
      {children}
      <StateModal data={modalData} />
    </StateModalContext.Provider>
  )
}