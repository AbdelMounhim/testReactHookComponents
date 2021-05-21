import React from "react"
import { Provider } from "react-redux"
import { combineReducers, createStore, applyMiddleware } from "redux"
import thunk from "redux-thunk"
import { render, fireEvent, cleanup } from "@testing-library/react"
import Counter from "./Counter"
import reducer, {
  selectCount,
  increment,
  decrement,
  incrementByAmount,
  incrementAsync,
} from "./counterSlice"

let store

const createTestStore = () =>
  createStore(combineReducers({ counter: reducer }), applyMiddleware(thunk))

const renderWithRedux = (component) =>
  render(<Provider store={store}>{component}</Provider>)

beforeEach(() => {
  store = createTestStore()
})
afterEach(cleanup)

it("Counter Component / initial State ", () => {
  const { getByTestId } = renderWithRedux(<Counter />)
  const initialState = {
    counter: {
      value: 0,
      status: "idle",
    },
  }
  expect(getByTestId("counter")).toHaveTextContent("0")
  expect(store.getState()).toEqual(initialState)
  expect(selectCount(store.getState())).toBe(0)
})

it("Counter component  / basic actions ", () => {
  const { getByTestId } = renderWithRedux(<Counter />)
  store.dispatch(increment())
  store.dispatch(decrement())
  store.dispatch(incrementByAmount(5))
  expect(getByTestId("counter")).toHaveTextContent("5")
})

it(" Counter component / incrementAsync", () => {
  const { getByTestId } = renderWithRedux(<Counter />)
  store.dispatch(incrementAsync(5)).then(() => {
    expect(getByTestId("counter")).toHaveTextContent("10")
  })
})

it(" Counter component / click increment button ", () => {
  const { getByTestId } = renderWithRedux(<Counter />)
  fireEvent.click(getByTestId("incrementButton"))
  expect(getByTestId("counter")).toHaveTextContent("1")
})

it(" Counter component / change increment amount value ", () => {
  const { getByTestId } = renderWithRedux(<Counter />)
  fireEvent.change(getByTestId("incrementAmount"), { target: { value: 4 } })
  fireEvent.click(getByTestId("incrementByAmount"))
  expect(getByTestId("counter")).toHaveTextContent("4")
})
