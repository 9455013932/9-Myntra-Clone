import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { itemsActions } from "../store/itemsSlice";
import { fetchStatusActions } from "../store/fetchStatusSlice";

const FetchItems = () => {
  const fetchStatus = useSelector((store) => store.fetchStatus);
  const dispatch = useDispatch();

  useEffect(() => {
    if (fetchStatus.fetchDone) return;

    const controller = new AbortController();
    const signal = controller.signal;

    const API_URL = process.env.REACT_APP_API_URL || "http://localhost:8080/items";

    dispatch(fetchStatusActions.markFetchingStarted());
    
    fetch(`https://9-myntra-clone-pi.vercel.app/`, { signal })
      .then((res) => {
        if (!res.ok) {
          throw new Error('Network response was not ok');
        }
        return res.json();
      })
      .then(({ items }) => {
        dispatch(fetchStatusActions.markFetchDone());
        dispatch(fetchStatusActions.markFetchingFinished());
        dispatch(itemsActions.addInitialItems(items));
      })
      .catch((error) => {
        console.error('Fetch error:', error);
        dispatch(fetchStatusActions.markFetchingFinished());
        // Optionally handle the error in the Redux store
      });

    return () => {
      controller.abort();
    };
  }, [fetchStatus, dispatch]);

  return null; // or any loading indicator you prefer
};

export default FetchItems;
