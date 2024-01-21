import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

const POSTS = [
  { id: 1, title: "Post 1" },
  { id: 2, title: "Post 2" },
];

function App() {
  const wait = (duration: number) => {
    return new Promise((resolve) => setTimeout(resolve, duration));
  };

  const queryClient = useQueryClient();

  //We are using the useQuery function to query the data...
  const postsQuery = useQuery({
    queryKey: ["posts"], // Naming the query
    queryFn: () => wait(1000).then(() => [...POSTS]),
  });

  const newPostsMutation = useMutation({
    mutationFn: (title: string) => {
      return wait(1000).then(() =>
        POSTS.push({ id: Math.floor(Math.random()), title })
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["posts"]); // Not sure why this is giving me an error but it seems to work!
    },
  });

  // You can do different things with modifiers here:
  if (postsQuery.isLoading) return <h2>Loading...</h2>;
  if (postsQuery.isError) {
    return <pre>{JSON.stringify(postsQuery.error)}</pre>;
  }

  return (
    <div>
      {postsQuery?.data?.map((post) => (
        <div key={post.id}>{post.title}</div>
      ))}
      <button
        disabled={newPostsMutation.isPending}
        onClick={() => newPostsMutation.mutate("New post")}
      >
        Add Post
      </button>
    </div>
  );
}

export default App;
