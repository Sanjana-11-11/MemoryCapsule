import { AxiosError } from "axios";
import { Eye, Loader2, Plus, UserRound } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getMemberImageUrl, getMembers, type Member } from "../../services/member";
import { PublicTeamLayout } from "./PublicTeamLayout";

const getErrorMessage = (error: unknown) => {
  if (error instanceof AxiosError) {
    return error.response?.data?.message || "Unable to load team members";
  }

  return "Unable to load team members";
};

export const ViewMembersPage = () => {
  const navigate = useNavigate();
  const [members, setMembers] = useState<Member[]>([]);
  const [loadingMembers, setLoadingMembers] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchMembers = async () => {
      try {
        const response = await getMembers();
        setMembers(response.data ?? []);
      } catch (fetchError) {
        setError(getErrorMessage(fetchError));
      } finally {
        setLoadingMembers(false);
      }
    };

    void fetchMembers();
  }, []);

  return (
    <PublicTeamLayout>
      <div className="mb-8 flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.22em] text-[#a855f7]">View Members</p>
          <h1 className="mt-2 text-4xl font-black text-white">All Team Members</h1>
          <p className="mt-3 max-w-2xl text-sm leading-6 text-violet-100/65">
            These profiles are fetched from MongoDB and show each member name, role, and uploaded profile image.
          </p>
        </div>
        <button
          type="button"
          onClick={() => navigate("/team/add")}
          className="inline-flex items-center gap-2 rounded-xl bg-[#7919e6] px-5 py-3 text-sm font-semibold text-white"
        >
          <Plus className="h-4 w-4" />
          Add Member
        </button>
      </div>

      {error && (
        <div className="mb-6 rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-100">
          {error}
        </div>
      )}

      {loadingMembers ? (
        <div className="flex min-h-64 items-center justify-center text-violet-100/65">
          <Loader2 className="mr-2 h-5 w-5 animate-spin" />
          Loading members...
        </div>
      ) : members.length === 0 ? (
        <div className="rounded-2xl border border-white/10 bg-white/[0.06] p-10 text-center backdrop-blur-xl">
          <UserRound className="mx-auto h-10 w-10 text-[#a855f7]" />
          <h2 className="mt-4 text-xl font-bold text-white">No members yet</h2>
          <p className="mt-2 text-sm text-violet-100/65">Add your first team member to begin the directory.</p>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {members.map((member) => (
            <article key={member._id} className="rounded-2xl border border-white/10 bg-white/[0.06] p-5 backdrop-blur-xl">
              <div className="flex items-center gap-4">
                <img
                  src={getMemberImageUrl(member.profilePicture)}
                  alt={member.name}
                  className="h-20 w-20 rounded-2xl object-cover"
                />
                <div className="min-w-0">
                  <h2 className="truncate text-xl font-bold text-white">{member.name}</h2>
                  <p className="mt-1 text-sm font-semibold text-[#a855f7]">{member.role}</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => navigate(`/members/${member._id}`)}
                className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-xl border border-white/10 px-4 py-3 text-sm font-semibold text-white hover:border-[#a855f7]"
              >
                <Eye className="h-4 w-4" />
                View Details
              </button>
            </article>
          ))}
        </div>
      )}
    </PublicTeamLayout>
  );
};
