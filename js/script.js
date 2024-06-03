const footer = document.querySelector("footer");

// Remove the noscript child (not really necessary)
document.querySelector("footer noscript").remove();

const CLUB_SOCIAL_JSON = "../json/club_socials.json";

// Function to capitalize the first letter of a string
function capitalizeFirstLetter(string) {
	return string.charAt(0).toUpperCase() + string.slice(1);
}

fetch(CLUB_SOCIAL_JSON)
	.then((response) => response.json())
	.then((data) => {
		// Create a container for the social links
		const container = document.createElement("div");
		container.className = "club_socials";

		// Iterate over each item in the "club" array
		data.club.forEach((social) => {
			// Create an anchor element for each social link
			const anchor = document.createElement("a");
			// Set the href attribute to the social link
			anchor.href = Object.values(social)[0];
			// Capitalize the first letter of the key and set it as the text content
			anchor.textContent = capitalizeFirstLetter(Object.keys(social)[0]);
			// Append the anchor to the container
			container.appendChild(anchor);
		});

		// Append the container to the footer
		let otherlinks = document.createElement("div");
		let members = document.createElement("a");
		members.href = "/teams.html";
		members.textContent = "Teams";
		otherlinks.appendChild(members);
		container.appendChild(otherlinks);
		footer.appendChild(container);
	})
	.catch((error) => console.error("Error:", error));

const PROJECTS_JSON = "../json/projects.json";
const TEAM_JSON = "../json/team.json";

// Fetch the projects and team data
Promise.all([
	fetch(PROJECTS_JSON).then((response) => response.json()),
	fetch(TEAM_JSON).then((response) => response.json()),
])
	.then(([projectsData, teamData]) => {
		// Find the latest project
		const latestProject = projectsData.projects.reduce((latest, current) => {
			return current.date[0].start_year > latest.date[0].start_year ||
				(current.date[0].start_year === latest.date[0].start_year &&
					current.date[0].start_month > latest.date[0].start_month) ||
				(current.date[0].start_year === latest.date[0].start_year &&
					current.date[0].start_month === latest.date[0].start_month &&
					current.date[0].start_day > latest.date[0].start_day)
				? current
				: latest;
		});

		// Find the team name for the latest project
		const team = teamData.teams.find((t) => t.id === latestProject.team);

		// Prepare the project details
		const projectDetails = {
			name: latestProject.name,
			id: team ? team.id : "is_there",
			team: team ? team.name : "Unknown",
			startDate: `${latestProject.date[0].start_year}-${latestProject.date[0].start_month}-${latestProject.date[0].start_day}`,
			image: latestProject.images.length > 0 ? latestProject.images[0] : null,
			notes: latestProject.notes || "No notes available.",
		};

		// Create the HTML for the featured project
		const featuredProjectHTML = `
        <div class="featured_project">
            <h2>Featured Project</h2>
            <h3>${projectDetails.name}</h3>
            <a href="/teams.html?id=${
							projectDetails.id
						}" title="Show more info about ${
							projectDetails.team
						}" class="teams">Team: ${projectDetails.team}</a>
            <p>Start Date: ${projectDetails.startDate}</p>
            ${
							projectDetails.image
								? `<img src="${projectDetails.image}" alt="${projectDetails.name}">`
								: ""
						}
            <p>Notes: ${projectDetails.notes}</p>
        </div>
    `;

		// Append the featured project HTML to the #featured_project element
		document.querySelector("#featured_project").innerHTML = featuredProjectHTML;
	})
	.catch((error) => console.error("Error:", error));
