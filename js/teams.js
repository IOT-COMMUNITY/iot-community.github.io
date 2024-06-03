// Get the id of the team
const id = new URLSearchParams(document.location.search).get("id");

// Relevant files
projects_json = "../json/projects.json";
clubs_social_json = "../json/club_socials.json";
team_json = "../json/team.json";
members_json = "../json/members.json";

async function fetchData(filePath) {
	const response = await fetch(filePath);
	if (!response.ok) {
		throw new Error(`HTTP error status: ${response.status}`);
	}
	return await response.json();
}
async function getTeamDetails(teamId) {
	try {
		// Fetch team data
		const teamsData = await fetchData(team_json);
		const team = teamsData.teams.find((t) => t.id === teamId);

		// Fetch projects data
		const projectsData = await fetchData(projects_json);

		// Fetch member data
		const membersData = await fetchData(members_json);

		if (team) {
			// Clear existing content
			document.getElementById("team-details").innerHTML = "";

			// Set the metadata of the page
			document.title = `${team.name} | Zetech IoT Club`;

			// Display team name and ID
			const teamInfo = document.createElement("div");
			teamInfo.innerHTML = `<b>Name:</b> ${team.name}<br><b>ID:</b> ${team.id}`;
			document.getElementById("team-details").appendChild(teamInfo);

			const members = membersData.members.filter((m) =>
				team.members.includes(m.id),
			);

			// Display members
			if (members.length === 0) {
				document.getElementById("team-details").innerHTML =
					"<p>No member in the team</p>";
			} else {
				const membersList = document.createElement("ul");
				membersList.innerHTML = `<h2>Members</h2>`;
				members.forEach((member) => {
					const listItem = document.createElement("li");
					listItem.innerHTML = `
                        <b>Name:</b> ${member.name}<br>
                        <b>Socials:</b><br>
                        <ul class="members_socials">${Object.entries(
													member.socials,
												)
													.filter(([key, value]) => value)
													.map(
														([key, value]) =>
															`<li><span class="social_key">${key}</span>: <a href="${value}">${value}</a></li>`,
													)
													.join("")}</ul>`;
					membersList.appendChild(listItem);
				});
				document.getElementById("team-details").appendChild(membersList);
			}

			const teamProjects = projectsData.projects.filter(
				(project) => project.team === teamId,
			);

			// Display projects
			if (teamProjects.length > 0) {
				const projectsList = document.createElement("ul");
				projectsList.innerHTML = `<h2>Projects</h2>`;
				teamProjects.forEach((project) => {
					const listItem = document.createElement("li");
					listItem.innerHTML = `
                        <b>Name:</b> ${project.name}<br>
                        <b>Description:</b><br>${
													project.description || "No description available"
												}<br>
                    `;
					projectsList.appendChild(listItem);
				});
				document.getElementById("team-details").appendChild(projectsList);
			} else {
				document.getElementById("team-details").innerHTML +=
					"<p>No project associated with this team.</p>";
			}
		} else {
			const teamList = document.createElement("ul");
			teamsData.teams.forEach((t) => {
				const tps = projectsData.projects.filter(
					(project) => project.team === t.id,
				);

				let arr = [];

				tps.forEach((d) => {
					arr.push(d.name);
				});

				let pn = humanReadable(arr);

				const members = membersData.members.filter((m) =>
					t.members.includes(m.id),
				);
				arr = [];
				members.forEach((d) => {
					arr.push(d.name);
				});
				let mn = humanReadable(arr);

				const listItem = document.createElement("li");
				listItem.className = "team_info";
				listItem.innerHTML = `
                    <p><a href="?id=${t.id}"><b>Name:</b> ${t.name}</a><p>
                    <p class="team_members"><b>Members:</b> ${
											mn || "No members"
										}</p>
                    <p class="team_projects"><b>Projects:</b> ${
											pn || "No projects yet"
										}</p>
                   <p class="team_notes"> <b>Notes:</b><br>${
											t.notes || "No note left"
										}</p>
                `;
				teamList.appendChild(listItem);
			});
			document.getElementById("team-details").innerHTML =
				"<h2>Available Teams</h2>" + teamList.outerHTML;
		}
	} catch (error) {
		console.error("Error fetching data:", error);
		document.getElementById("team-details").innerHTML =
			"<p>Error loading team details.</p>";
	}
}

function humanReadable(array) {
	let al = array.length;
	let str = "";

	if (al === 1) {
		return array[0];
	}

	for (let i = 0; i < al - 2; i++) {
		str += array[i] + ", ";
	}

	if (al >= 2) {
		str += array[al - 2] + " and " + array[al - 1];
	}

	return str.trim();
}

getTeamDetails(id);
