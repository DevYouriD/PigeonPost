package org.example;

import org.bukkit.Bukkit;
import org.bukkit.event.EventHandler;
import org.bukkit.event.Listener;
import org.bukkit.event.player.PlayerJoinEvent;
import org.bukkit.event.player.PlayerQuitEvent;
import org.bukkit.plugin.java.JavaPlugin;

import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;

public class PigeonPostPlugin extends JavaPlugin implements Listener {

    private final HttpClient http = HttpClient.newHttpClient();

    private final String ENDPOINT = "http://192.168.2.4:3000/event";

    @Override
    public void onEnable() {
        Bukkit.getPluginManager().registerEvents(this, this);

        getLogger().info("PigeonPost enabled");

        send("test", "server-start");
    }

    @EventHandler
    public void onJoin(PlayerJoinEvent event) {
        send("join", event.getPlayer().getName());
    }

    @EventHandler
    public void onQuit(PlayerQuitEvent event) {
        send("leave", event.getPlayer().getName());
    }

    private void send(String type, String player) {
        try {
            String json = """
            {
                "type": "%s",
                "player": "%s",
                "time": %d
            }
            """.formatted(type, player, System.currentTimeMillis());

            HttpRequest request = HttpRequest.newBuilder()
                    .uri(URI.create(ENDPOINT))
                    .header("Content-Type", "application/json")
                    .POST(HttpRequest.BodyPublishers.ofString(json))
                    .build();

            http.sendAsync(request, HttpResponse.BodyHandlers.ofString());

            getLogger().info("Sent event: " + type + " " + player);

        } catch (Exception e) {
            getLogger().warning("HTTP failed: " + e.getMessage());
        }
    }
}