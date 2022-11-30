import styles from "./List.module.css";

type ListParams = {};

const List = (props: ListParams) => {
  return (
    <div className={styles.card}>
      <h2 className={styles.headline}>This is an example!</h2>
      <h3>ToDo List</h3>
      <ul>
        <li>List entry 1</li>
        <li>List entry 2</li>
      </ul>
      <hr />
        <h3>Done List</h3>
      <ul>
        <li>List entry 3</li>
        <li>List entry 4</li>
      </ul>
    </div>
  );
};

export default List;