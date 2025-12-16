
package com.psysafe.util;

import com.google.gson.*;
import java.lang.reflect.Type;
import java.time.LocalDate;
import java.time.format.DateTimeFormatter;

public class LocalDateAdapter implements JsonSerializer<LocalDate>, JsonDeserializer<LocalDate> {

    // Define o formato de data padrão ISO (ex: "2025-10-26")
    private static final DateTimeFormatter DATE_FORMAT = DateTimeFormatter.ISO_LOCAL_DATE;

    // Serialização (Java -> JSON)
    @Override
    public JsonElement serialize(LocalDate src, Type typeOfSrc, JsonSerializationContext context) {
        if (src == null) {
            return JsonNull.INSTANCE;
        }
        // Converte LocalDate para uma string no formato ISO
        return new JsonPrimitive(src.format(DATE_FORMAT));
    }

    // Desserialização (JSON -> Java)
    @Override
    public LocalDate deserialize(JsonElement json, Type typeOfT, JsonDeserializationContext context) throws JsonParseException {
        if (json == null || json.isJsonNull() || json.getAsString().isEmpty()) {
            return null;
        }
        try {
            // Converte a string JSON para LocalDate
            return LocalDate.parse(json.getAsString(), DATE_FORMAT);
        } catch (java.time.format.DateTimeParseException e) {
            throw new JsonParseException("Não foi possível desserializar a data: " + json.getAsString(), e);
        }
    }
}